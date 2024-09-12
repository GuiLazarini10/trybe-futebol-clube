import { Leaderboard } from './LeaderBoard';
import MatchWithTeams from './TeamMatch';

export interface leaderBoardSup {
  getFinishedMatches(): Promise<MatchWithTeams[]>,
  getHomeTeamStats(): Promise<Leaderboard[]>,
}
