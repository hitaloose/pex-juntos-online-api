import { QueryInterface, DataTypes, Sequelize } from "sequelize";

type Ctx = Sequelize;

export async function up({ context }: { context: Ctx }) {
  const qi: QueryInterface = context.getQueryInterface();

  await qi.createTable("provider", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER },
    name: { type: DataTypes.STRING },
    phoneWhatsapp: { type: DataTypes.STRING },
    neighborhood: { type: DataTypes.STRING },
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
  await qi.dropTable("provider");
}
