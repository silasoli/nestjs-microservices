import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriesService } from '../categories/categories.service';
import { Match } from '../matches/interfaces/match.interface';
import { MatchesService } from '../matches/matches.service';
import { Player } from '../players/interfaces/player.interface';
import { PlayersService } from '../players/players.service';
import { AssignChallengeMatchDto } from './dtos/assign-challenge-match.dto';
import { CreateChallengeDto } from './dtos/create-challenge.dto';
import { UpdateChallengeDto } from './dtos/update-challenge.dto';
import { ChallengeStatus } from './enums/challenge-status.enum';
import { Challenge } from './interfaces/challenge.interface';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
    private readonly matchesService: MatchesService,
    private readonly playersService: PlayersService,
    private readonly categoriesService: CategoriesService,
  ) {}

  private checkRequesterinMatch(
    requester: string,
    players: Array<string>,
  ): void {
    const requesterExistsinPlayers = players.includes(requester);

    if (!requesterExistsinPlayers)
      throw new BadRequestException(
        `Requesting player must be a challenge player`,
      );
  }

  private checkWinnerinChallenge(winner: Player, players: Array<Player>): void {
    const requesterExistsinPlayers = players.includes(winner);

    if (!requesterExistsinPlayers)
      throw new BadRequestException(`Winner player must be a challenge player`);
  }

  private async validCreateChallenge(dto: CreateChallengeDto): Promise<void> {
    const { requester, players } = dto;

    this.checkRequesterinMatch(requester, players);
    await this.playersService.checkExistenceOfPlayers(players);
  }

  private async getCategoryOfPlayer(requester: string): Promise<string> {
    const category = await this.categoriesService.findCategoryByPlayer(
      requester,
    );

    if (!category)
      throw new BadRequestException(
        'The requester needs to be registered in a category!',
      );

    return category.category;
  }

  private async createMatchForChallenge(
    challenge: Challenge,
    dto: AssignChallengeMatchDto,
  ): Promise<Match> {
    const match = {
      category: challenge.category,
      players: challenge.players,
      ...dto,
    };

    return this.matchesService.create(match);
  }

  private async setMatchInChallenge(_id: string, matchId: string) {
    const dto = { status: ChallengeStatus.REALIZED, match: matchId };

    try {
      await this.challengeModel.updateOne({ _id }, dto);
    } catch (error) {
      await this.matchesService.remove(matchId);
      throw new InternalServerErrorException();
    }
  }

  public async create(dto: CreateChallengeDto): Promise<Challenge> {
    await this.validCreateChallenge(dto);
    const category = await this.getCategoryOfPlayer(dto.requester);

    const challenge = {
      ...dto,
      category,
      status: ChallengeStatus.PENDING,
      requestDateTime: new Date(),
    };

    return this.challengeModel.create(challenge);
  }

  public async findAllChallenges(): Promise<Challenge[]> {
    return this.challengeModel
      .find()
      .populate([
        { path: 'players' },
        { path: 'requester' },
        { path: 'match' },
      ]);
  }

  public async findChallengesByPlayer(playerId: string): Promise<Challenge[]> {
    await this.playersService.checkExistenceOfPlayers([playerId]);

    return this.challengeModel
      .find({
        players: { $in: [playerId] },
      })
      .populate([
        { path: 'players' },
        { path: 'requester' },
        { path: 'match' },
      ]);
  }

  public async findOne(_id: string): Promise<Challenge> {
    return this.findChallengeById(_id);
  }

  public async findChallengeById(_id: string): Promise<Challenge> {
    const existsChallenge = await this.challengeModel.findOne({ _id });

    if (!existsChallenge)
      throw new NotFoundException(`Challenge with ID ${_id} not found`);

    return existsChallenge;
  }

  public async update(_id: string, dto: UpdateChallengeDto): Promise<void> {
    const existsChallenge = await this.findChallengeById(_id);

    if (dto.status) {
      existsChallenge.responseDateTime = new Date();
      existsChallenge.status = dto.status;
    }

    existsChallenge.challengeDateTime = dto.challengeDateTime;

    await this.challengeModel.updateOne({ _id }, existsChallenge);
  }

  public async assignChallengeMatch(
    _id: string,
    dto: AssignChallengeMatchDto,
  ): Promise<void> {
    const winner = await this.playersService.findPlayerById(dto.winner);
    const challenge = await this.findChallengeById(_id);
    this.checkWinnerinChallenge(winner, challenge.players);

    const match = await this.createMatchForChallenge(challenge, dto);

    await this.setMatchInChallenge(_id, match._id);
  }

  public async remove(_id: string): Promise<void> {
    const existsChallenge = await this.findChallengeById(_id);

    existsChallenge.status = ChallengeStatus.CANCELED;

    await this.challengeModel.updateOne({ _id }, existsChallenge);
  }
}
