import { Router } from 'express';

import authRouter from './auth-router';
import favouriteRouter from './favourite-router';
import listingRouter from './listing-router';
import reservationRouter from './reservation-router';

const router: Router = Router();

router.use('/auth', authRouter);
router.use('/favourites', favouriteRouter);
router.use('/listings', listingRouter);
router.use('/reservations', reservationRouter);

export default router;
