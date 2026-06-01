import { Router } from 'express';
import { authorizationMiddleware } from '../middlewares/authorization-middleware.js';
import { uploadMiddleware } from '../middlewares/upload-middleware.js';
import { providerController } from '../controllers/provider-controller.js';

export const providerRoutes = Router();

providerRoutes.use(authorizationMiddleware);
providerRoutes.put(
  '/',
  uploadMiddleware.single('image'),
  providerController.update
);
