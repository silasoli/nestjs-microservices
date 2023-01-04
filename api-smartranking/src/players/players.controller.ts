import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  async createOrUpdatePlayer(@Body() dto: CreatePlayerDto) {
    return this.playersService.createOrUpdatePlayer(dto);
  }

  @Get()
  async findPlayers(@Query('email') email: string): Promise<Player[] | Player> {
    if (email) return this.playersService.findPlayerByEmail(email);
    return this.playersService.findAllPlayers();
  }

  @Delete()
  async deletePlayer(@Query('email') email: string): Promise<void> {
    return this.playersService.deletePlayerByEmail(email);
  }
}
