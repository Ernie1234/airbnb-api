import express, { Router } from 'express';

import { createListing, getAllListings, getListing } from '../controllers/listings-controller';
import { authenticationJWT } from '../middlewares/auth-middleware';
import { validateCreateListing, validateListingId } from '../middlewares/listings-middleware';

const listingRoutes: Router = express.Router();

listingRoutes.post('/', authenticationJWT, validateCreateListing, createListing);

listingRoutes.get('/', getAllListings);
listingRoutes.get('/:listingId', validateListingId, getListing);

export default listingRoutes;
