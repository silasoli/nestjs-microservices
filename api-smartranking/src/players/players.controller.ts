import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
} from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common/pipes';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { UpdatePlayerDto } from './dtos/update-player.dto';
import { Player } from './interfaces/player.interface';
import { PlayersValidationsParamsPipe } from './pipes/players-validations-params.pipe';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() dto: CreatePlayerDto): Promise<Player> {
    return this.playersService.createPlayer(dto);
  }

  @Get()
  async findAll(): Promise<Player[]> {
    return this.playersService.findAllPlayers();
  }

  @Get('/:id')
  async findById(
    @Param('id', PlayersValidationsParamsPipe) id: string,
  ): Promise<Player> {
    return this.playersService.findPlayerById(id);
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  async updateById(
    @Param('id', PlayersValidationsParamsPipe) id: string,
    @Body() dto: UpdatePlayerDto,
  ): Promise<void> {
    await this.playersService.updateOnePlayer(id, dto);
  }

  @Delete('/:id')
  async deleteById(
    @Param('id', PlayersValidationsParamsPipe) id: string,
  ): Promise<any> {
    return this.playersService.deletePlayerById(id);
  }
}
