export interface Match {
  category: string;
  challenge: string;
  players: string[];
  def: string;
  results: Array<Result>;
}

export interface Result {
  set: string;
}
