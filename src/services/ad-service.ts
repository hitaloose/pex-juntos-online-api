import { Op, Transaction } from "sequelize";

import { Ad } from "../models/ad";
import { escapeLike } from "../utils/search";
import { NotFoundHttpError } from "../errors/not-found-http-error";
import { adSchema, searchAdsSchema } from "../schemas/ad-schemas";
import z from "zod";
import { Provider } from "../models/provider";
import { CATEGORIES } from "../utils/category";
import { AdStatus } from "../types/ad-status";
import { UnprocessableEntityHttpError } from "../errors/unprocessable-entity-http-error";
import { s3Service } from "./s3-service";

class AdService {
  async search(values: z.infer<typeof searchAdsSchema>) {
    const where: any = {
      status: AdStatus.ACTIVATED,
    };
    const providerWhere: any = {};

    if (values.category) {
      where.category = values.category;
    }

    if (values.neighborhood) {
      providerWhere.neighborhood = values.neighborhood;
    }

    if (values.providerId) {
      where.providerId = values.providerId;
    }

    if (values.q && values.q.trim()) {
      const raw = values.q.trim();
      const needle = `%${escapeLike(raw).replace(/\s+/g, "%")}%`;
      where[Op.or] = [
        { title: { [Op.like]: needle } },
        { description: { [Op.like]: needle } },
      ];
    }

    const ads = await Ad.findAll({
      where,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Provider,
          as: "provider",
          where: providerWhere,
        },
      ],
    });

    return ads;
  }

  async getAll(userId?: number) {
    const where: any = {
      status: {
        [Op.in]: [AdStatus.ACTIVATED, AdStatus.DISABLED, AdStatus.HIDDEN],
      },
    };

    if (userId) {
      const provider = await Provider.findOne({ where: { userId } });
      if (!provider) {
        throw new NotFoundHttpError("Prestador de serviço não encontrado");
      }

      where.providerId = provider.id;
    }

    const ads = await Ad.findAll({
      where,
      order: [["createdAt", "DESC"]],
      include: [{ model: Provider, as: "provider" }],
    });

    return ads;
  }

  async get(id: number) {
    const ad = await Ad.findOne({
      where: { id, status: AdStatus.ACTIVATED },
      include: [{ model: Provider, as: "provider" }],
    });
    if (!ad) {
      throw new NotFoundHttpError("Anúncio não encontrado");
    }

    return ad;
  }

  async create(
    userId: number,
    input: z.infer<typeof adSchema>,
    transaction: Transaction
  ) {
    const provider = await Provider.findOne({ where: { userId } });
    if (!provider) {
      throw new NotFoundHttpError("Prestador de serviço não encontrado");
    }

    const category = CATEGORIES.find((c) => c.value === input.category);
    if (!category) {
      throw new NotFoundHttpError("Categoria não encontrado");
    }

    const ad = Ad.build({
      ...input,
      providerId: provider.id,
      status: AdStatus.ACTIVATED,
    });

    await this.uploadImage(ad, input.image);
    await ad.save({ transaction });

    await ad.reload({
      include: [{ model: Provider, as: "provider" }],
      transaction,
    });
    return ad;
  }

  private async uploadImage(ad: Ad, image?: Express.Multer.File) {
    if (!image) {
      return;
    }

    if (ad.imageKey) {
      const exists = await s3Service.exists(ad.imageKey);
      if (exists) {
        await s3Service.delete(ad.imageKey);
      }
    }

    const key = `${crypto.randomUUID()}-${image.originalname}`;
    const upload = await s3Service.upload(key, image.buffer, image.mimetype);

    ad.imageKey = upload.key;
    ad.imageUrl = upload.url;
  }

  async update(
    userId: number,
    adId: number,
    input: z.infer<typeof adSchema>,
    transaction: Transaction
  ) {
    const provider = await Provider.findOne({ where: { userId } });
    if (!provider) {
      throw new NotFoundHttpError("Prestador de serviço não encontrado");
    }

    const ad = await Ad.findOne({
      where: { id: adId, providerId: provider.id },
    });
    if (!ad) {
      throw new NotFoundHttpError("Anúncio não encontrado");
    }

    const category = CATEGORIES.find((c) => c.value === input.category);
    if (!category) {
      throw new NotFoundHttpError("Categoria não encontrado");
    }

    await this.uploadImage(ad, input.image);
    Object.assign(ad, input);
    await ad.save({ transaction });

    await ad.reload({
      include: [{ model: Provider, as: "provider" }],
      transaction,
    });
    return ad;
  }

  async toggleHide(adId: number) {
    const ad = await Ad.findOne({ where: { id: adId } });
    if (!ad) {
      throw new NotFoundHttpError("Anúncio não encontrado");
    }

    const adActivated = ad.status === AdStatus.ACTIVATED;
    const newStatus = adActivated ? AdStatus.HIDDEN : AdStatus.ACTIVATED;
    ad.status = newStatus;

    await ad.save();

    return ad;
  }

  async toggleStatus(userId: number, adId: number) {
    const provider = await Provider.findOne({ where: { userId } });
    if (!provider) {
      throw new NotFoundHttpError("Prestador de serviço não encontrado");
    }

    const ad = await Ad.findOne({
      where: { id: adId, providerId: provider.id },
    });
    if (!ad) {
      throw new NotFoundHttpError("Anúncio não encontrado");
    }

    if (ad.status === AdStatus.HIDDEN) {
      throw new UnprocessableEntityHttpError(
        "Anúncio oculto pelo administrador"
      );
    }

    const adActivated = ad.status === AdStatus.ACTIVATED;
    const newStatus = adActivated ? AdStatus.DISABLED : AdStatus.ACTIVATED;

    ad.status = newStatus;

    await ad.save();

    return ad;
  }

  async delete(userId: number, adId: number) {
    const provider = await Provider.findOne({ where: { userId } });
    if (!provider) {
      throw new NotFoundHttpError("Prestador de serviço não encontrado");
    }

    const ad = await Ad.findOne({
      where: { id: adId, providerId: provider.id },
    });
    if (!ad) {
      throw new NotFoundHttpError("Anúncio não encontrado");
    }

    ad.status = AdStatus.REMOVED;

    await ad.save();
  }
}

export const adService = new AdService();
