import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ValidationsParamsPipe } from '../common/pipes/validations-params.pipe';
import { ClientProxySmartRanking } from '../proxyrmq/client-proxy';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Observable } from 'rxjs';
import { UpdatePlayerDto } from './dtos/update-player.dto';

@Controller('players')
export class PlayersController {
  constructor(private clientProxySmartRanking: ClientProxySmartRanking) {}

  private clientAdminBackend =
    this.clientProxySmartRanking.getClientProxyAdminBackendInstance();

  @Post()
  @UsePipes(ValidationPipe)
  async createPlayer(@Body() dto: CreatePlayerDto) {
    const category = await this.clientAdminBackend.send(
      'get-categories',
      dto.category,
    );

    if (category) {
      await this.clientAdminBackend.emit('create-player', dto);
    } else {
      throw new BadRequestException(`Categoria não cadastrada!`);
    }
  }

  @Get()
  getPlayers(@Query('id') _id: string): Observable<any> {
    return this.clientAdminBackend.send('get-player', _id ? _id : '');
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async updatePlayer(
    @Body() dto: UpdatePlayerDto,
    @Param('_id', ValidationsParamsPipe) _id: string,
  ) {
    const category = await this.clientAdminBackend.send(
      'get-categories',
      dto.category,
    );

    if (category) {
      await this.clientAdminBackend.emit('update-player', {
        id: _id,
        player: dto,
      });
    } else {
      throw new BadRequestException(`Category not found!`);
    }
  }

  @Delete('/:_id')
  async deletePlayer(@Param('_id', ValidationsParamsPipe) _id: string) {
    await this.clientAdminBackend.emit('delete-player', { _id });
  }
}
