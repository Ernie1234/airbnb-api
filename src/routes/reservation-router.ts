// src/routes/reservation-router.ts
import express, { Router } from 'express';

import {
  cancelReservation,
  createReservation,
  getReservationById,
  getReservations,
} from '../controllers/reservation-controller';
import { authenticationJWT } from '../middlewares/auth-middleware';
import { validateCreateReservation, validateReservationId } from '../middlewares/reservation-middleware';

const reservationRoutes: Router = express.Router();

reservationRoutes.post('/', authenticationJWT, validateCreateReservation, createReservation);

reservationRoutes.get('/', authenticationJWT, getReservations);
reservationRoutes.get('/:reservationId', authenticationJWT, validateReservationId, getReservationById);
reservationRoutes.delete('/:reservationId', authenticationJWT, validateReservationId, cancelReservation);

export default reservationRoutes;
