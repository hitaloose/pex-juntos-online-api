import { Request, Response } from "express";
import { adSchema, searchAdsSchema } from "../schemas/ad-schemas";
import { adService } from "../services/ad-service";
import { positiveIntSchema } from "../schemas/common-schemas";
import { HttpStatusCode } from "../types/http-status-code";
import { Role } from "../types/role";

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
    const body = adSchema.parse(request.body);
    const userId = request.userId;

    const ad = await adService.create(userId, body);

    response.status(HttpStatusCode.CREATED).json({ ad });
  }

  async get(request: Request, response: Response) {
    const id = positiveIntSchema.parse(request.params.id);

    const ad = await adService.get(id);

    response.json({ ad });
  }

  async update(request: Request, response: Response) {
    const id = positiveIntSchema.parse(request.params.id);
    const userId = request.userId;
    const body = adSchema.parse(request.body);

    const ad = await adService.update(userId, id, body);

    response.json({ ad });
  }

  async delete(request: Request, response: Response) {
    const id = positiveIntSchema.parse(request.params.id);
    const userId = request.userId;

    await adService.delete(userId, id);

    response.send();
  }

  async toggleStatus(request: Request, response: Response) {
    const id = positiveIntSchema.parse(request.params.id);
    const userId = request.userId;

    const ad = await adService.toggleStatus(userId, id);

    response.json({ ad });
  }

  async toggleHide(request: Request, response: Response) {
    const id = positiveIntSchema.parse(request.params.id);

    const ad = await adService.toggleHide(id);

    response.json({ ad });
  }
}

export const adController = new AdController();
