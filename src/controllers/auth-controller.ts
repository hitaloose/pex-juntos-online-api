import { Request, Response } from "express";
import { loginSchema, signupSchema } from "../schemas/auth-schemas";
import { authService } from "../services/auth-service";
import { db } from "../utils/db";

class AuthController {
  async signup(request: Request, response: Response) {
    const transaction = await db.transaction();

    try {
      const body = signupSchema.parse(request.body);

      const output = await authService.signup(transaction, body);

      await transaction.commit();
      response.json(output);
    } catch (error) {
      await transaction.rollback();

      throw error;
    }
  }

  async login(request: Request, response: Response) {
    const body = loginSchema.parse(request.body);

    const output = await authService.login(body);

    response.json(output);
  }

  async me(request: Request, response: Response) {
    const output = await authService.me(request.userId);

    response.json(output);
  }
}

export const authController = new AuthController();
