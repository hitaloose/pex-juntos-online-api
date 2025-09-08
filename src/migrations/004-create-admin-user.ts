import { Sequelize } from "sequelize";
import { User } from "../models/user";
import { Role } from "../types/role";
import { hash } from "../utils/bcrypt";
import { Provider } from "../models/provider";
import { CONFIG } from "../config";

type Ctx = Sequelize;

export async function up({ context }: { context: Ctx }) {
  if (!CONFIG.DEFAULT_ADMIN_PASSWORD || !CONFIG.DEFAULT_ADMIN_EMAIL) {
    throw Error("Credenciais do administrador devem ser configuradas");
  }

  const hashedPassword = await hash(CONFIG.DEFAULT_ADMIN_PASSWORD);
  const admin = await User.create({
    email: CONFIG.DEFAULT_ADMIN_EMAIL,
    role: Role.ADMIN,
    hashedPassword,
  });
  await Provider.create({
    name: "ADMIN",
    neighborhood: "",
    phoneWhatsapp: "",
    userId: admin.id,
  });
}

export async function down({ context }: { context: Ctx }) {
  if (!CONFIG.DEFAULT_ADMIN_PASSWORD || !CONFIG.DEFAULT_ADMIN_EMAIL) {
    throw Error("Credenciais do administrador devem ser configuradas");
  }

  const admin = await User.findOne({
    where: { email: CONFIG.DEFAULT_ADMIN_EMAIL },
  });

  if (admin) {
    const provider = await Provider.findOne({ where: { userId: admin.id } });

    await admin.destroy();
    if (provider) {
      await provider.destroy();
    }
  }
}
