import express, { Request, Response, Router } from 'express';

import { getListing } from '@controllers/listings-controller';

const listingRoutes: Router = express.Router();

listingRoutes.get('/', async (req: Request, res: Response) => {
  res.status(200).json({ message: 'All listings' });
});

listingRoutes.get('/:id', getListing);

export default listingRoutes;
