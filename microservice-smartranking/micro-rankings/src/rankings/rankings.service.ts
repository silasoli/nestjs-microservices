import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RpcException } from '@nestjs/microservices';
import { ClientProxySmartRanking } from '../proxyrmq/client-proxy';
import * as momentTimezone from 'moment-timezone';
import * as _ from 'lodash';

@Injectable()
export class RankingsService {
  constructor(
    @InjectModel('Ranking') private readonly challengeModel: Model<Ranking>,
    private clientProxySmartRanking: ClientProxySmartRanking,
  ) {}

  private readonly logger = new Logger(RankingsService.name);

  private clientAdminBackend =
    this.clientProxySmartRanking.getClientProxyAdminBackendInstance();

  private clientChallenges =
    this.clientProxySmartRanking.getClientProxyChallengesInstance();

  async processMatch(matchId: string, match: Match): Promise<void> {
    try {
      const category: Category = await this.clientAdminBackend
        .send('get-categories', match.category)
        .toPromise();

      await Promise.all(
        match.players.map(async (player) => {
          const ranking = new this.challengeModel();

          ranking.category = match.category;
          ranking.challenge = match.challenge;
          ranking.match = matchId;
          ranking.player = player;

          if (player === match.def) {
            const eventFilter = category.events.filter(
              (event) => event.name === EventName.VICTORY,
            );

            ranking.event = EventName.VICTORY;
            ranking.operation = eventFilter[0].operation;
            ranking.points = eventFilter[0].value;
          } else {
            const eventFilter = category.events.filter(
              (event) => event.name === EventName.DEFEAT,
            );

            ranking.event = EventName.DEFEAT;
            ranking.operation = eventFilter[0].operation;
            ranking.points = eventFilter[0].value;
          }

          this.logger.log(`ranking: ${JSON.stringify(ranking)}`);

          await ranking.save();
        }),
      );
    } catch (error) {
      this.logger.error(`error: ${error}`);
      throw new RpcException(error.message);
    }
  }

  async getRankings(
    categoryId: any,
    dateRef: string,
  ): Promise<RankingResponse[] | RankingResponse> {
    try {
      this.logger.log(`categoryId: ${categoryId} dateRef: ${dateRef}`);

      if (!dateRef) {
        dateRef = momentTimezone().tz('America/Sao_Paulo').format('YYYY-MM-DD');
        this.logger.log(`dateRef: ${dateRef}`);
      }

      /*
                Retrieve processed match records, filtering by the received category.
            */
      const rankingRecords = await this.challengeModel
        .find()
        .where('category')
        .equals(categoryId)
        .exec();

      /*
                Now, let's retrieve all challenges with a date less than or equal to the
                date we received in the request.
                We will only retrieve challenges with the status set to 'COMPLETED' and
                filter by the category.
            */
      const challenges: Challenge[] = await this.clientChallenges
        .send('get-completed-challenges', {
          categoryId: categoryId,
          dateRef: dateRef,
        })
        .toPromise();

      /*
                We will loop through the ranking records (processed matches)
                and discard the records (based on the challenge id) that are not returned
                in the challenges object.
            */
      _.remove(rankingRecords, function (item) {
        return (
          challenges.filter((challenge) => challenge._id == item.challenge)
            .length == 0
        );
      });

      this.logger.log(`rankingRecords: ${JSON.stringify(rankingRecords)}`);

      // Group by player

      const result = _(rankingRecords)
        .groupBy('player')
        .map((items, key) => ({
          player: key,
          history: _.countBy(items, 'event'),
          points: _.sumBy(items, 'points'),
        }))
        .value();

      const sortedResult = _.orderBy(result, 'points', 'desc');

      this.logger.log(`sortedResult: ${JSON.stringify(sortedResult)}`);

      const rankingResponseList: RankingResponse[] = [];

      sortedResult.map(function (item, index) {
        const rankingResponse: RankingResponse = {};

        rankingResponse.player = item.player;
        rankingResponse.position = index + 1;
        rankingResponse.score = item.points;

        const history: History = {};

        history.victories = item.history.VICTORY ? item.history.VICTORY : 0;
        history.defeats = item.history.DEFEAT ? item.history.DEFEAT : 0;
        rankingResponse.matchHistory = history;

        rankingResponseList.push(rankingResponse);
      });

      return rankingResponseList;
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }
}
