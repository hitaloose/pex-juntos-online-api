import { Router } from "express";
import { authController } from "../controllers/auth-controller";
import { authorizationMiddleware } from "../middlewares/authorization-middleware";

export const authRoutes = Router();

authRoutes.post("/signup", authController.signup);
authRoutes.post("/login", authController.login);
authRoutes.get("/me", authorizationMiddleware, authController.me);
