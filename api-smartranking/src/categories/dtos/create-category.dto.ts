import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsArray, ArrayMinSize } from 'class-validator';
import { Event } from '../interfaces/event.interface';
export class CreateCategoryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsArray()
  @ArrayMinSize(1)
  events: Array<Event>;
}
