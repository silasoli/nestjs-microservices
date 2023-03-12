import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  Put,
  Logger,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChallengesService } from './challenges.service';
import { AssignChallengeMatchDto } from './dtos/assign-challenge-match.dto';
import { CreateChallengeDto } from './dtos/create-challenge.dto';
import { UpdateChallengeDto } from './dtos/update-challenge.dto';
import { Challenge } from './interfaces/challenge.interface';
import { ChallengeStatusValidationPipe } from './pipes/challenge-status-validation.pipe';

@ApiTags('Challenges')
@Controller('challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  private readonly logger = new Logger(ChallengesController.name);

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() dto: CreateChallengeDto): Promise<Challenge> {
    this.logger.log(`CreateChallengeDto: ${JSON.stringify(dto)}`);
    return this.challengesService.create(dto);
  }

  @Get()
  findAll(): Promise<Challenge[]> {
    return this.challengesService.findAllChallenges();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Challenge> {
    return this.challengesService.findOne(id);
  }

  @Get('/player/:id')
  findChallengesByPlayer(
    @Param('playerId') playerId: string,
  ): Promise<Challenge[]> {
    return this.challengesService.findChallengesByPlayer(playerId);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  update(
    @Param('id') id: string,
    @Body(ChallengeStatusValidationPipe) dto: UpdateChallengeDto,
  ): Promise<void> {
    return this.challengesService.update(id, dto);
  }

  @Post(':id/match')
  assingChallengeMatch(
    @Body(ValidationPipe) dto: AssignChallengeMatchDto,
    @Param('id') id: string,
  ): Promise<void> {
    return this.challengesService.assignChallengeMatch(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.challengesService.remove(id);
  }
}
