import { Sequelize } from "sequelize";
import { CONFIG } from "../config";

export const db = new Sequelize({
  dialect: CONFIG.DB_DIALECT,
  storage: CONFIG.DB_STORAGE,
});

export async function assertDatabaseConnectionOk() {
  try {
    await db.authenticate();
    console.log("✅ Conexão com o banco OK");
  } catch (error) {
    console.error("❌ Erro ao conectar no banco:", error);
    process.exit(1);
  }
}

export const setupDb = (models: any[]) => {
  models.forEach((model) => {
    model.associate();
  });
};
