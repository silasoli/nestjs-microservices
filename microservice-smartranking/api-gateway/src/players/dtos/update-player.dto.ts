import { OmitType } from '@nestjs/swagger';
import { CreatePlayerDto } from './create-player.dto';

export class UpdatePlayerDto extends OmitType(CreatePlayerDto, [
  'email',
] as const) {}
