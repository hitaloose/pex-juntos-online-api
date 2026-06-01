import { Request, Response } from 'express';
import { adSchema, searchAdsSchema } from '../schemas/ad-schemas.js';
import { adService } from '../services/ad-service.js';
import { positiveIntSchema } from '../schemas/common-schemas.js';
import { HttpStatusCode } from '../types/http-status-code.js';
import { Role } from '../types/role.js';
import { db } from '../utils/db.js';
import { invalidateAdCache } from '../utils/cache.js';

class AdController {
  async search(request: Request, response: Response) {
    const query = searchAdsSchema.parse(request.query);

    const ads = await adService.search(query);

    response.json({ ads });
  }

  async getAll(request: Request, response: Response) {
    let userId: number | undefined = request.userId;

    if (request.user.role === Role.ADMIN) {
      userId = undefined;
    }

    const ads = await adService.getAll(userId);

    response.json({ ads });
  }

  async create(request: Request, response: Response) {
    const transaction = await db.transaction();

    try {
      const body = adSchema.parse({ ...request.body, image: request.file });
      const userId = request.userId;

      const ad = await adService.create(userId, body, transaction);

      await transaction.commit();
      invalidateAdCache();
      response.status(HttpStatusCode.CREATED).json({ ad });
    } catch (error) {
      await transaction.rollback();

      throw error;
    }
  }

  async get(request: Request, response: Response) {
    const id = positiveIntSchema.parse(request.params.id);

    const ad = await adService.get(id);

    response.json({ ad });
  }

  async update(request: Request, response: Response) {
    const transaction = await db.transaction();

    try {
      const id = positiveIntSchema.parse(request.params.id);
      const userId = request.userId;
      const body = adSchema.parse({ ...request.body, image: request.file });

      const ad = await adService.update(userId, id, body, transaction);

      await transaction.commit();
      invalidateAdCache();
      response.json({ ad });
    } catch (error) {
      await transaction.rollback();

      throw error;
    }
  }

  async delete(request: Request, response: Response) {
    const id = positiveIntSchema.parse(request.params.id);
    const userId = request.userId;

    await adService.delete(userId, id);
    invalidateAdCache();

    response.send();
  }

  async toggleStatus(request: Request, response: Response) {
    const id = positiveIntSchema.parse(request.params.id);
    const userId = request.userId;

    const ad = await adService.toggleStatus(userId, id);
    invalidateAdCache();

    response.json({ ad });
  }

  async toggleHide(request: Request, response: Response) {
    const id = positiveIntSchema.parse(request.params.id);

    const ad = await adService.toggleHide(id);
    invalidateAdCache();

    response.json({ ad });
  }
}

export const adController = new AdController();
