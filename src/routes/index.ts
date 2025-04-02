import { Router } from 'express';

import authRouter from './auth-router';
import favouriteRouter from './favourite-router';
import listingRouter from './listing-router';
import reservationRouter from './reservation-router';
import commentRoutes from './comment-router';

const router: Router = Router();

router.use('/auth', authRouter);
router.use('/favourites', favouriteRouter);
router.use('/listings', listingRouter);
router.use('/reservations', reservationRouter);
router.use('/comments', commentRoutes);

export default router;
