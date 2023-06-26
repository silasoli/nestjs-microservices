import { Logger } from "@nestjs/common";
import { Match } from "./interfaces/match.interface";
import { Challenge } from "../challenges/interfaces/challenge.interface";
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClientProxySmartRanking } from "../proxyrmq/client-proxy";

export class MatchesService {
  constructor(
    @InjectModel('Match') private readonly matchModel: Model<Match>,
    private clientProxySmartRanking: ClientProxySmartRanking,
  ) {}

  private readonly logger = new Logger(MatchesService.name);

  private clientChallenges =
    this.clientProxySmartRanking.getClientProxyChallengesInstance();

  private clientRankings =
    this.clientProxySmartRanking.getClientProxyRankingsInstance();

  async createMatch(match: Match): Promise<Match> {
    try {
      const createdMatch = new this.matchModel(match);
      this.logger.log(`createdMatch: ${JSON.stringify(createdMatch)}`);
      const result = await createdMatch.save();
      this.logger.log(`result: ${JSON.stringify(result)}`);
      const matchId = result._id;
      const challenge: Challenge = await this.clientChallenges
        .send('get-challenge', { playerId: '', _id: match.challenge })
        .toPromise();
      await this.clientChallenges
        .emit('update-challenge-match', {
          matchId: matchId,
          challenge: challenge,
        })
        .toPromise();
      return await this.clientRankings
        .emit('process-match', { matchId: matchId, match: match })
        .toPromise();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }
}
