import express from 'express';
import cors from 'cors';
import { routes } from './routes.js';
import { errorHandlerMiddleware } from './middlewares/error-handler-middleware.js';

export const api = express();

api.use(express.json());
api.use(cors());

api.use('/api/v1', routes);

api.use(errorHandlerMiddleware);
