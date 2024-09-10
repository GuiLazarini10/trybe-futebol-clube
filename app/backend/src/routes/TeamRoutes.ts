import { Router } from 'express';
import TeamController from '../controllers/TeamControllers';

const router = Router();

router.get('/teams', TeamController.getAllTeams);
router.get('/teams/:id', TeamController.getTeamById);
export default router;
