import { Response, Router } from 'express';
import Logger from '../libs/logger';

const router: Router = Router();

/**
 * @swagger
 * /logger:
 *   get:
 *     description: Logs different levels of logging messages and displays them
 *     responses:
 *       200:
 *         description: Returns a message indicating the status of the request
 */
router.get('/', (req, res: Response) => {
  Logger.error('This is an error log');
  Logger.info('This is an info log');
  Logger.warn('This is a warning log');
  Logger.debug('This is a debug log');
  Logger.http('This is an http log');
  res.status(200).send('Logger is working');
});

export default router;
