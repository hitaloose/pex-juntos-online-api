import { z } from 'zod';
import { loginSchema, signupSchema } from '../schemas/auth-schemas.js';
import { UnprocessableEntityHttpError } from '../errors/unprocessable-entity-http-error.js';
import { User } from '../models/user.js';
import { compare, hash } from '../utils/bcrypt.js';
import { encode } from '../utils/jwt.js';
import { Role } from '../types/role.js';
import { Provider } from '../models/provider.js';
import { Transaction } from 'sequelize';

class AuthService {
  async signup(transaction: Transaction, input: z.infer<typeof signupSchema>) {
    if (input.password !== input.passwordConfirmation) {
      throw new UnprocessableEntityHttpError('Senhas não batem');
    }

    const checkingUser = await User.findOne({ where: { email: input.email } });
    if (checkingUser) {
      throw new UnprocessableEntityHttpError('Email já cadastrado');
    }

    const hashedPassword = await hash(input.password);
    const user = await User.create(
      {
        ...input,
        hashedPassword,
        role: Role.PROVIDER,
      },
      { transaction }
    );

    await Provider.create(
      {
        ...input,
        userId: user.id,
      },
      { transaction }
    );

    const token = encode(user.id);

    await user.reload({
      include: [{ model: Provider, as: 'provider' }],
      transaction,
    });
    return { user, token };
  }

  async login(input: z.infer<typeof loginSchema>) {
    const user = await User.findOne({
      where: { email: input.email },
      include: [{ model: Provider, as: 'provider' }],
    });

    if (!user) {
      throw new UnprocessableEntityHttpError('E-mail não cadastrado');
    }

    const checkingPassword = await compare(input.password, user.hashedPassword);
    if (!checkingPassword) {
      throw new UnprocessableEntityHttpError('Senha incorreta');
    }

    const token = encode(user.id);

    return { user, token };
  }

  async me(id: number) {
    const user = await User.findOne({
      where: { id },
      include: [{ model: Provider, as: 'provider' }],
    });
    if (!user) {
      throw new UnprocessableEntityHttpError('Usuário não encontrado');
    }

    return { user };
  }
}

export const authService = new AuthService();
