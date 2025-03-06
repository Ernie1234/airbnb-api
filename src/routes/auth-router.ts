import { Router } from 'express';

import { loginUser, registerUser } from '../controllers/auth-controller';
import { validateUserLogin, validateUserRegistration } from '../middlewares/auth-middleware';

const router = Router();

router.post('/register', validateUserRegistration, registerUser);
router.post('/login', validateUserLogin, loginUser);

export default router;
