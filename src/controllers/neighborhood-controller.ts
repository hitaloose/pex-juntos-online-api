import { Request, Response } from "express";
import { providerService } from "../services/provider-service";

class NeighborhoodController {
  async getAll(request: Request, response: Response) {
    const neighborhoods = await providerService.getNeighborhoods();

    response.json({ neighborhoods });
  }
}

export const neighborhoodController = new NeighborhoodController();
