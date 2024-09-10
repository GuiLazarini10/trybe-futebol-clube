import { Router } from 'express';
import MatchController from '../controllers/MatchController';

const router = Router();

router.get('/', MatchController.getAllMatches);

export default router;
