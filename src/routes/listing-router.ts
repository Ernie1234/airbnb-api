import express, { Router } from 'express';

import { createListing, getAllListings, getListing } from '@controllers/listings-controller';
import { authenticationJWT } from '@middlewares/auth-middleware';
import { validateCreateListing, validateListingId } from '@middlewares/listings-middleware';

const listingRoutes: Router = express.Router();

listingRoutes.get('/', getAllListings);

listingRoutes.post('/', authenticationJWT, validateCreateListing, createListing);

listingRoutes.get('/:listingId', authenticationJWT, validateListingId, getListing);

export default listingRoutes;
