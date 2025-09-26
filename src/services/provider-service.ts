import { Op, Transaction } from "sequelize";
import { Provider } from "../models/provider";
import { db } from "../utils/db";
import z from "zod";
import { providerSchema } from "../schemas/provider-schemas";
import { NotFoundHttpError } from "../errors/not-found-http-error";
import { s3Service } from "./s3-service";

class ProviderService {
  async getNeighborhoods() {
    const providers = await Provider.findAll({
      where: { neighborhood: { [Op.not]: "" } },
      attributes: [[db.fn("DISTINCT", db.col("neighborhood")), "neighborhood"]],
      order: [["neighborhood", "DESC"]],
    });

    return providers.map((provider) => provider.neighborhood);
  }

  async update(
    userId: number,
    input: z.infer<typeof providerSchema>,
    transaction: Transaction
  ) {
    const provider = await Provider.findOne({ where: { userId } });
    if (!provider) {
      throw new NotFoundHttpError("Provedor de serviço não encontrado");
    }

    await this.uploadImage(provider, input.image);
    Object.assign(provider, input);
    await provider.save({ transaction });

    return provider;
  }

  private async uploadImage(provider: Provider, image?: Express.Multer.File) {
    if (!image) {
      return;
    }

    if (provider.imageKey) {
      const exists = await s3Service.exists(provider.imageKey);
      if (exists) {
        await s3Service.delete(provider.imageKey);
      }
    }

    const key = `${crypto.randomUUID()}-${image.originalname}`;
    const upload = await s3Service.upload(key, image.buffer, image.mimetype);

    provider.imageKey = upload.key;
    provider.imageUrl = upload.url;
  }
}

export const providerService = new ProviderService();
