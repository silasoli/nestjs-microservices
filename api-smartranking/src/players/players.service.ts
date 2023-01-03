import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PlayersService {
  private players: Player[] = [];

  private readonly logger = new Logger(PlayersService.name);

  private create(dto: CreatePlayerDto): void {
    const { name, phone, email } = dto;

    const player: Player = {
      _id: uuidv4(),
      name,
      phone,
      email,
      ranking: 'A',
      rankingPosition: 1,
      imageUrl: 'url',
    };
    this.logger.log(`Create a player: ${JSON.stringify(player)}`);
    this.players.push(player);
  }

  private updateOne(player: Player, dto: CreatePlayerDto): void {
    const { name } = dto;
    player.name = name;
  }

  public createOrUpdatePlayer(dto: CreatePlayerDto): void {
    const { email } = dto;

    const existsPlayer = this.players.find((player) => player.email === email);

    if (existsPlayer) return this.updateOne(existsPlayer, dto);
    return this.create(dto);
  }

  public async findAllPlayers(): Promise<Player[]> {
    return this.players;
  }

  public async findPlayerByEmail(email: string): Promise<Player> {
    const existsPlayer = this.players.find((player) => player.email === email);
    if (!existsPlayer)
      throw new NotFoundException(`Player with email ${email} not found`);

    return existsPlayer;
  }

  public async deletePlayerByEmail(email: string): Promise<void> {
    const existsPlayer = await this.findPlayerByEmail(email);

    this.players = this.players.filter(
      (player) => player.email !== existsPlayer.email,
    );
  }
}
