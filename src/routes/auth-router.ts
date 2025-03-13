import { Router } from 'express';

import { checkSession, loginUser, registerUser } from '../controllers/auth-controller';
import { authenticateToken, validateUserLogin, validateUserRegistration } from '../middlewares/auth-middleware';

const router = Router();

router.post('/register', validateUserRegistration, registerUser);
router.post('/login', validateUserLogin, loginUser);
router.get('/check-session', authenticateToken, checkSession);

export default router;
