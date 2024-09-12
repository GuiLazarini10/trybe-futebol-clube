import LeaderboardModel from '../database/models/LeaderBoard.model';

export default class LeaderboardService {
  constructor(private leaderboardModel = new LeaderboardModel()) {}

  async getHomeLeaderboard() {
    const homeStats = await this.leaderboardModel.getHomeTeamStats();
    return homeStats;
  }
}
