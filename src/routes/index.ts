import { Router } from 'express';

import loggerRouter from './logger-router';

const router: Router = Router();

router.use('/logger', loggerRouter);

export default router;
