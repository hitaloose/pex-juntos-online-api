import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from "sequelize";
import { db } from "../utils/db";
import { Provider } from "./provider";
import { AdStatus } from "../types/ad-status";

export class Ad extends Model<
  InferAttributes<Ad>,
  InferCreationAttributes<Ad>
> {
  declare id: CreationOptional<number>;
  declare providerId: number;
  declare title: string;
  declare description: string;
  declare category: string;
  declare status: AdStatus;

  declare provider?: NonAttribute<Provider>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  static associate() {
    Ad.belongsTo(Provider, {
      foreignKey: "providerId",
      as: "provider",
    });
  }
}

Ad.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    providerId: {
      type: DataTypes.INTEGER.UNSIGNED,
    },
    title: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    category: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize: db,
    tableName: "ad",
  }
);
