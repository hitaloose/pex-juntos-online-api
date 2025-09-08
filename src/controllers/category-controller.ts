import { Request, Response } from "express";
import { CATEGORIES } from "../utils/category";

class CategoryController {
  async getAll(request: Request, response: Response) {
    response.json({ data: CATEGORIES });
  }
}

export const categoryController = new CategoryController();
