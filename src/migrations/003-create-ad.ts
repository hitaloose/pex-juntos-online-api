import { QueryInterface, DataTypes, Sequelize } from "sequelize";

type Ctx = Sequelize;

export async function up({ context }: { context: Ctx }) {
  const qi: QueryInterface = context.getQueryInterface();

  await qi.createTable("ad", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    providerId: { type: DataTypes.INTEGER },
    title: { type: DataTypes.STRING },
    description: { type: DataTypes.STRING },
    category: { type: DataTypes.STRING },
    status: { type: DataTypes.STRING },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });
}

export async function down({ context }: { context: Ctx }) {
  const qi: QueryInterface = context.getQueryInterface();
  await qi.dropTable("ad");
}
