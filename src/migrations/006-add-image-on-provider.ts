import { QueryInterface, DataTypes, Sequelize } from "sequelize";

type Ctx = Sequelize;

export async function up({ context }: { context: Ctx }) {
  const qi: QueryInterface = context.getQueryInterface();

  await qi.addColumn("provider", "imageKey", {
    type: DataTypes.STRING,
    defaultValue: "",
  });
  await qi.addColumn("provider", "imageUrl", {
    type: DataTypes.STRING,
    defaultValue: "",
  });
}

export async function down({ context }: { context: Ctx }) {
  const qi: QueryInterface = context.getQueryInterface();

  await qi.removeColumn("provider", "imageKey");
  await qi.removeColumn("provider", "imageUrl");
}
