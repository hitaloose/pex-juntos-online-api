import { User } from '../../src/models/user';
import { Provider } from '../../src/models/provider';
import { Ad } from '../../src/models/ad';
import { Role } from '../../src/types/role';
import { AdStatus } from '../../src/types/ad-status';

export function createMockUser(overrides?: Partial<User>): Partial<User> {
  return {
    id: 1,
    email: 'test@example.com',
    hashedPassword: 'hashed-password',
    role: Role.PROVIDER,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

export function createMockProvider(overrides?: Partial<Provider>): Partial<Provider> {
  return {
    id: 1,
    userId: 1,
    name: 'Test Provider',
    phone: '11999999999',
    whatsapp: '11999999999',
    neighborhood: 'Centro',
    city: 'São Paulo',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

export function createMockAd(overrides?: Partial<Ad>): Partial<Ad> {
  return {
    id: 1,
    providerId: 1,
    title: 'Test Ad',
    description: 'Test Description',
    category: 'reformas',
    status: AdStatus.ACTIVATED,
    imageKey: null,
    imageUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}
