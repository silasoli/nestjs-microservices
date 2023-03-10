import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BadRequestException } from '@nestjs/common/exceptions';
import { UpdatePlayerDto } from './dtos/update-player.dto';
import * as mongodb from 'mongodb';
@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  public async checkExistenceOfPlayers(players: Array<string>): Promise<void> {
    for (const player of players) {
      await this.findPlayerById(player);
    }
  }

  public async validateCreation(dto: CreatePlayerDto): Promise<void> {
    const existsPlayer = await this.playerModel.findOne({ email: dto.email });

    if (existsPlayer)
      throw new BadRequestException(
        `Player with email ${dto.email} already registered`,
      );
  }

  public async createPlayer(dto: CreatePlayerDto): Promise<Player> {
    await this.validateCreation(dto);
    return this.playerModel.create(dto);
  }

  public async findAllPlayers(): Promise<Player[]> {
    return this.playerModel.find();
  }

  public async findPlayerById(_id: string | Player): Promise<Player> {
    const existsPlayer = await this.playerModel.findOne({ _id });

    if (!existsPlayer)
      throw new NotFoundException(`Player with ID ${_id} not found`);

    return existsPlayer;
  }

  public async updateOnePlayer(
    _id: string,
    dto: UpdatePlayerDto,
  ): Promise<void> {
    await this.findPlayerById(_id);
    await this.playerModel.updateOne({ _id }, dto);
  }

  public async deletePlayerById(_id: string): Promise<mongodb.DeleteResult> {
    await this.findPlayerById(_id);
    return this.playerModel.deleteOne({ _id });
  }
}
