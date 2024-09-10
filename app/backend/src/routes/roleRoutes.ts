import { Router } from 'express';
import RoleController from '../controllers/RoleController';
import validateToken from '../middlewares/validateToken';

const router = Router();

router.get('/login/role', validateToken, RoleController.getUserRole);

export default router;
