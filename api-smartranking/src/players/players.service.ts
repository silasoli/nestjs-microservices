import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  private async create(dto: CreatePlayerDto): Promise<Player> {
    return this.playerModel.create(dto);
  }

  private async updateOne(dto: CreatePlayerDto): Promise<Player> {
    return this.playerModel.findOneAndUpdate(
      { email: dto.email },
      { $set: dto },
    );
  }

  public async findPlayerByEmail(email: string): Promise<Player> {
    const existsPlayer = await this.playerModel.findOne({ email });

    if (!existsPlayer) throw new NotFoundException(`Player not found`);

    return existsPlayer;
  }

  public async createOrUpdatePlayer(dto: CreatePlayerDto): Promise<Player> {
    const existsPlayer = await this.playerModel.findOne({ email: dto.email });

    if (existsPlayer) return this.updateOne(dto);
    return this.create(dto);
  }

  public async findAllPlayers(): Promise<Player[]> {
    return this.playerModel.find();
  }

  public async deletePlayerByEmail(email: string): Promise<void> {
    await this.findPlayerByEmail(email);
    return this.playerModel.remove({ email });
  }
}
