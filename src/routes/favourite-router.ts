import express, { Router } from 'express';

import {
  createFavouriteListing,
  deleteFavouriteListing,
  getFavouriteListings,
} from '../controllers/favouriting-controller';
import { authenticationJWT } from '../middlewares/auth-middleware';

const listingRoutes: Router = express.Router();

listingRoutes.post('/:listingId', authenticationJWT, createFavouriteListing);
listingRoutes.delete('/:listingId', authenticationJWT, deleteFavouriteListing);
listingRoutes.get('/', authenticationJWT, getFavouriteListings);

export default listingRoutes;
