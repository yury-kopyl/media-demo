import * as envProd from '../environments/environment.prod';
import * as envDev from '../environments/environment';

export const env = process.env.NODE_ENV.trim() === 'production' ? envProd.environment : envDev.environment;
