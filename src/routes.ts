import { Router } from 'express';
import { authRoutes } from './routes/auth-routes.js';
import { adRoutes } from './routes/ad-routes.js';
import { categoryRoutes } from './routes/cateogry-routes.js';
import { neighborhoodRoute } from './routes/neighborhood-route.js';
import { providerRoutes } from './routes/provider-routes.js';

export const routes = Router();

routes.use('/auth', authRoutes);
routes.use('/ad', adRoutes);
routes.use('/category', categoryRoutes);
routes.use('/neighborhood', neighborhoodRoute);
routes.use('/provider', providerRoutes);
