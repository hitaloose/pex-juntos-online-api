import { Sequelize } from 'sequelize';
import { User } from '../models/user.js';
import { Role } from '../types/role.js';
import { hash } from '../utils/bcrypt.js';
import { Provider } from '../models/provider.js';
import { CONFIG } from '../config.js';

type Ctx = Sequelize;

export async function up({ context: _context }: { context: Ctx }) {
  if (!CONFIG.DEFAULT_ADMIN_PASSWORD || !CONFIG.DEFAULT_ADMIN_EMAIL) {
    throw Error('Credenciais do administrador devem ser configuradas');
  }

  const hashedPassword = await hash(CONFIG.DEFAULT_ADMIN_PASSWORD);
  const admin = await User.create({
    email: CONFIG.DEFAULT_ADMIN_EMAIL,
    role: Role.ADMIN,
    hashedPassword,
  });

  // Raw insert: provider table does not have imageKey/imageUrl yet (added in 006)
  const qi = _context.getQueryInterface();
  await qi.bulkInsert('provider', [
    {
      userId: admin.id,
      name: 'ADMIN',
      neighborhood: '',
      phoneWhatsapp: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
}

export async function down({ context: _context }: { context: Ctx }) {
  if (!CONFIG.DEFAULT_ADMIN_PASSWORD || !CONFIG.DEFAULT_ADMIN_EMAIL) {
    throw Error('Credenciais do administrador devem ser configuradas');
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
