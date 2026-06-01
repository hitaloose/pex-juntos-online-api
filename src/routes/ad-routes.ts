import { Router } from 'express';
import { adController } from '../controllers/ad-controller.js';
import { authorizationMiddleware } from '../middlewares/authorization-middleware.js';
import { onlyAdminMiddleware } from '../middlewares/only-admin-middleware.js';
import { uploadMiddleware } from '../middlewares/upload-middleware.js';
import { cacheMiddleware } from '../middlewares/memory-cache-middleware.js';

export const adRoutes = Router();

adRoutes.get('/search', cacheMiddleware, adController.search);
adRoutes.get('/:id', cacheMiddleware, adController.get);

adRoutes.use(authorizationMiddleware);
adRoutes.get('/', adController.getAll);
adRoutes.post('/', uploadMiddleware.single('image'), adController.create);
adRoutes.put('/:id', uploadMiddleware.single('image'), adController.update);
adRoutes.delete('/:id', adController.delete);
adRoutes.patch('/:id/toggle-status', adController.toggleStatus);

adRoutes.use(onlyAdminMiddleware);
adRoutes.patch('/:id/toggle-hide', adController.toggleHide);
