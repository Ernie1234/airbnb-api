import { Router } from 'express';

import authRouter from './auth-router';
import listingRouter from './listing-router';

const router: Router = Router();

router.use('/auth', authRouter);
router.use('/listings', listingRouter);

export default router;
