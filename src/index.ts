import express, { Request, Response } from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import helmet from 'helmet';
import cors from 'cors';

import Logger from '@libs/logger';
import morganMiddleware from '@middlewares/morgan-middleware';
import envConfig from './config/env-config';
import routes from './routes/index';

const { PORT } = envConfig;

export const app = express();
// eslint-disable-next-line consistent-return
export const main = async () => {
  try {
    app.use(helmet());
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(morganMiddleware);

    app.use('/api/v1', routes);

    // Swagger configuration options
    const swaggerOptions = {
      swaggerDefinition: {
        info: {
          title: 'My Note App API',
          version: '1.0.0',
          description: 'API documentation for my Express application',
        },
        servers: [
          {
            url: `http://localhost:${PORT}/api/v1`,
          },
        ],
      },
      apis: ['./src/routes/*.ts'],
    };

    const swaggerDocs = swaggerJSDoc(swaggerOptions);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

    app.get('/', (req: Request, res: Response) => {
      res.send('Welcome to Express & TypeScript Server');
    });

    app.get('/healths', (req: Request, res: Response) => {
      res.send('Working in good health');
    });

    // Start the server and return the instance
    return app.listen(PORT, () => {
      Logger.info(`Server is started at port: http://localhost:${PORT}`);
    }); // Return the server instance
  } catch (error) {
    Logger.error(error);
  }
};

// main();

export default {
  app,
  main,
};
