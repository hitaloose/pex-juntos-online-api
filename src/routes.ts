import { Router } from "express";
import { authRoutes } from "./routes/auth-routes";
import { adRoutes } from "./routes/ad-routes";
import { categoryRoutes } from "./routes/cateogry-routes";
import { neighborhoodRoute } from "./routes/neighborhood-route";

export const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/ad", adRoutes);
routes.use("/category", categoryRoutes);
routes.use("/neighborhood", neighborhoodRoute);
