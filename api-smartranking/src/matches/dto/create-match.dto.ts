import { IsNotEmpty, IsString } from 'class-validator';
import { Result } from '../../challenges/interfaces/result.interface';

export class CreateMatchDto {
  @IsString()
  @IsNotEmpty()
  winner: string;

  @IsNotEmpty()
  result: Result[];
}
