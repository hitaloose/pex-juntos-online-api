import { Router } from "express";
import { adController } from "../controllers/ad-controller";
import { authorizationMiddleware } from "../middlewares/authorization-middleware";
import { onlyAdminMiddleware } from "../middlewares/only-admin-middleware";

export const adRoutes = Router();

adRoutes.get("/search", adController.search);
adRoutes.get("/:id", adController.get);

adRoutes.use(authorizationMiddleware);
adRoutes.get("/", adController.getAll);
adRoutes.post("/", adController.create);
adRoutes.put("/:id", adController.update);
adRoutes.delete("/:id", adController.delete);
adRoutes.patch("/:id/toggle-status", adController.toggleStatus);

adRoutes.use(onlyAdminMiddleware);
adRoutes.patch("/:id/toggle-hide", adController.toggleHide);
