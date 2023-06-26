export interface RankingResponse {
  player?: string;
  position?: number;
  score?: number;
  matchHistory?: MatchHistory;
}

export interface MatchHistory {
  victories?: number;
  defeats?: number;
}
