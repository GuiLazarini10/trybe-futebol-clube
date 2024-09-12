import Match from './Match';

export default interface MatchWithTeams extends Match {
  homeTeam: { teamName:string },
  awayTeam: { teamName:string },
}
