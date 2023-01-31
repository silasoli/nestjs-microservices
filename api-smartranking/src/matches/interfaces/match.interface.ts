import { Document } from 'mongoose';
import { Player } from '../../players/interfaces/player.interface';
import { Result } from '../../challenges/interfaces/result.interface';

export interface Match extends Document {
  category: string;
  players: Array<Player>;
  winner: Player;
  result: Array<Result>;
}
