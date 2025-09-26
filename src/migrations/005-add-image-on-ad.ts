import { QueryInterface, DataTypes, Sequelize } from "sequelize";

type Ctx = Sequelize;

export async function up({ context }: { context: Ctx }) {
  const qi: QueryInterface = context.getQueryInterface();

  await qi.addColumn("ad", "imageKey", {
    type: DataTypes.STRING,
    defaultValue: "",
  });
  await qi.addColumn("ad", "imageUrl", {
    type: DataTypes.STRING,
    defaultValue: "",
  });
}

export async function down({ context }: { context: Ctx }) {
  const qi: QueryInterface = context.getQueryInterface();

  await qi.removeColumn("ad", "imageKey");
  await qi.removeColumn("ad", "imageUrl");
}
