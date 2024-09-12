import { Router } from 'express';
import LeaderboardController from '../controllers/LeaderboardController';

const leaderboardController = new LeaderboardController();

const leaderboardRouter = Router();

leaderboardRouter.get('/home', (req, res) => leaderboardController.getHomeLeaderboard(req, res));

export default leaderboardRouter;
