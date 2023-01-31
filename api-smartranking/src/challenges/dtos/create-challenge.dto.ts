import {
  IsNotEmpty,
  IsArray,
  ArrayMinSize,
  IsDateString,
  ArrayMaxSize,
} from 'class-validator';

export class CreateChallengeDto {
  @IsNotEmpty()
  @IsDateString()
  challengeDateTime: string;

  @IsNotEmpty()
  requester: string;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  players: Array<string>;
}
