import 'dotenv/config';

type EnvConfig = {
  PORT: number;
  NODE_ENV: string;
  MONGODB_URL: string;
  JWT_SECRET: string;
  LOG_LEVEL: string;
  FRONTEND_BASE_URL: string;
  VERCEL_BASE_URL: string;
  MOBILE_APP_BASE_URL: string;
};

type ENV = Partial<EnvConfig> & {
  [K in keyof EnvConfig]: EnvConfig[K] | undefined;
};

const getConfig = (): ENV => ({
  PORT: Number(process.env.PORT),
  NODE_ENV: process.env.NODE_ENV,
  MONGODB_URL: process.env.MONGODB_URL,
  FRONTEND_BASE_URL: process.env.FRONTEND_BASE_URL,
  VERCEL_BASE_URL: process.env.VERCEL_BASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  MOBILE_APP_BASE_URL: process.env.MOBILE_APP_BASE_URL,
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
});

const getSanitizedConfig = (config: ENV): EnvConfig => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in .env`);
    }
  }
  return config as EnvConfig;
};

const config = getConfig();

const sanitizedConfig = getSanitizedConfig(config);

export default sanitizedConfig;
