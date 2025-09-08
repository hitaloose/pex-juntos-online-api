import { Op } from "sequelize";
import { Provider } from "../models/provider";
import { db } from "../utils/db";

class ProviderService {
  async getNeighborhoods() {
    const providers = await Provider.findAll({
      where: { neighborhood: { [Op.not]: "" } },
      attributes: [[db.fn("DISTINCT", db.col("neighborhood")), "neighborhood"]],
      order: [["neighborhood", "DESC"]],
    });

    return providers.map((provider) => provider.neighborhood);
  }
}

export const providerService = new ProviderService();
