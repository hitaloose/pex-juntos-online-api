import { QueryInterface, DataTypes, Sequelize } from "sequelize";

type Ctx = Sequelize;

export async function up({ context }: { context: Ctx }) {
  const qi: QueryInterface = context.getQueryInterface();

  await qi.createTable("user", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    hashedPassword: { type: DataTypes.STRING, allowNull: true },
    role: {
      type: DataTypes.STRING(16),
      allowNull: false,
      defaultValue: "provider",
    },
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
  await qi.dropTable("users");
}
