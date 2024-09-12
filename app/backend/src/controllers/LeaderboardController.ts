// src/controllers/LeaderboardController.ts

import { Request, Response } from 'express';
import LeaderboardService from '../Services/LeaderboardService';

export default class LeaderboardController {
  private leaderboardService = new LeaderboardService();

  public async getHomeLeaderboard(req: Request, res: Response): Promise<Response> {
    try {
      const leaderboard = await this.leaderboardService.getHomeLeaderboard();
      return res.status(200).json(leaderboard);
    } catch (error) {
      console.error('Error fetching home leaderboard:', error);
      return res.status(500).json({ message: 'Internal error while fetching leaderboard' });
    }
  }
}
