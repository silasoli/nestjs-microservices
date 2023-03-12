import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { ChallengeStatus } from '../enums/challenge-status.enum';

export class UpdateChallengeDto {
  @ApiProperty()
  @IsOptional()
  challengeDateTime: Date;

  @ApiProperty()
  @IsOptional()
  status: ChallengeStatus;
}
