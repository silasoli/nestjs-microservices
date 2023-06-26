import { ChallengeStatus } from "../enums/challenge-status.enum";

export interface Challenge {
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
