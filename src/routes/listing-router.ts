import express, { Router } from 'express';

import { createListing, getAllListings, getListing } from '@controllers/listings-controller';
import { authenticationJWT } from '@middlewares/auth-middleware';
import { validateCreateListing } from '@middlewares/listings-middleware';

const listingRoutes: Router = express.Router();

listingRoutes.get('/', getAllListings);

listingRoutes.post('/', authenticationJWT, validateCreateListing, createListing);

listingRoutes.get('/:id', authenticationJWT, getListing);

export default listingRoutes;
