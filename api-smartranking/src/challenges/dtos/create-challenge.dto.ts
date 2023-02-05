import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsArray,
  ArrayMinSize,
  IsDateString,
  ArrayMaxSize,
} from 'class-validator';

export class CreateChallengeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  challengeDateTime: string;

  @ApiProperty()
  @IsNotEmpty()
  requester: string;

  @ApiProperty()
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  players: Array<string>;
}
