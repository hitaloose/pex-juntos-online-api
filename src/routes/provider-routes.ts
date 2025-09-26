import { Router } from "express";
import { authorizationMiddleware } from "../middlewares/authorization-middleware";
import { uploadMiddleware } from "../middlewares/upload-middleware";
import { providerController } from "../controllers/provider-controller";

export const providerRoutes = Router();

providerRoutes.use(authorizationMiddleware);
providerRoutes.put(
  "/",
  uploadMiddleware.single("image"),
  providerController.update
);
