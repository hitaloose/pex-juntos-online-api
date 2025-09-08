import { Router } from "express";
import { neighborhoodController } from "../controllers/neighborhood-controller";

export const neighborhoodRoute = Router();

neighborhoodRoute.get("/", neighborhoodController.getAll);
