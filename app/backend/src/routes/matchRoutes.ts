import { Router } from 'express';
import MatchController from '../controllers/MatchController';
import authMiddleware from '../middlewares/validateToken';

const router = Router();

router.get('/', (req, res) => MatchController.getAllMatches(req, res));
router.patch('/:id/finish', authMiddleware, MatchController.finishMatch);
router.patch('/:id', authMiddleware, MatchController.updateMatch);
router.post('/', authMiddleware, MatchController.createMatch);

export default router;
