import express, { Router } from 'express';

import { getAllListings, getListing } from '@controllers/listings-controller';
import { authenticationJWT } from '@middlewares/auth-middleware';

const listingRoutes: Router = express.Router();

listingRoutes.get('/', getAllListings);

listingRoutes.get('/:id', authenticationJWT, getListing);

export default listingRoutes;
