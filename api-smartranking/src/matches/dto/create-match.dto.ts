import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Result } from '../../challenges/interfaces/result.interface';

export class CreateMatchDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  winner: string;

  @ApiProperty()
  @IsNotEmpty()
  result: Result[];
}
