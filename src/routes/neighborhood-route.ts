import { Router } from 'express';
import { neighborhoodController } from '../controllers/neighborhood-controller.js';

export const neighborhoodRoute = Router();

neighborhoodRoute.get('/', neighborhoodController.getAll);
