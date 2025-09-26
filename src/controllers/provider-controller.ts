import { Request, Response } from "express";
import { db } from "../utils/db";
import { providerSchema } from "../schemas/provider-schemas";
import { providerService } from "../services/provider-service";

class ProviderController {
  async update(request: Request, response: Response) {
    const transaction = await db.transaction();

    try {
      const userId = request.userId;
      const body = providerSchema.parse({
        ...request.body,
        image: request.file,
      });

      const provider = await providerService.update(userId, body, transaction);

      await transaction.commit();
      response.json({ provider });
    } catch (error) {
      await transaction.rollback();

      throw error;
    }
  }
}

export const providerController = new ProviderController();
