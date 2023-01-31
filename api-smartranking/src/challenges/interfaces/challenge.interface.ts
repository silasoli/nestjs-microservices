import { Document } from 'mongoose';
import { Player } from '../../players/interfaces/player.interface';
import { ChallengeStatus } from '../enums/challenge-status.enum';
import { Match } from '../../matches/interfaces/match.interface';

export interface Challenge extends Document {
  challengeDateTime: Date;
  status: ChallengeStatus;
  requestDateTime: Date;
  responseDateTime: Date;
  requester: Player;
  category: string;
  players: Array<Player>;
  match: Match;
}
