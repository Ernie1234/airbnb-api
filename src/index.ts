import express, { Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';

import Logger from '@libs/logger';
import morganMiddleware from '@middlewares/morgan-middleware';
import connectDb from '@config/connect';
import envConfig from './config/env-config';
import routes from './routes/index';

const { PORT, MONGODB_URL } = envConfig;

const app = express();

// eslint-disable-next-line consistent-return
export const main = async () => {
  try {
    app.use(helmet());
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(morganMiddleware);

    app.get('/', (req: Request, res: Response) => {
      res.send('Welcome to Express & TypeScript Server');
    });

    app.use('/api/v1', routes);

    app.get('/healths', (req: Request, res: Response) => {
      res.send('Working in good health');
    });

    // Start the server
    await connectDb(MONGODB_URL);
    return app.listen(PORT, () => {
      Logger.info(`Server is started at port: http://localhost:${PORT}`);
    });
  } catch (error) {
    Logger.error(error);
  }
};

// Export app as default
export default app;
