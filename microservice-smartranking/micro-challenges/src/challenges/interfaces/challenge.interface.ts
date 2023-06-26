import { Document } from 'mongoose';
import { ChallengeStatus } from '../enum/challenge-status.enum';

export interface Challenge extends Document {
  _id: string;
  challengeDateTime: Date;
  status: ChallengeStatus;
  requestDateTime: Date;
  responseDateTime?: Date;
  requester: string;
  category: string;
  match?: string;
  players: string[];
}
