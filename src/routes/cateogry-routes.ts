import { Router } from 'express';
import { categoryController } from '../controllers/category-controller.js';

export const categoryRoutes = Router();

categoryRoutes.get('/', categoryController.getAll);
