import { Model, Sequelize } from 'sequelize';
import { vi } from 'vitest';

const createMockModel = () => {
  const mockModel = {
    init: vi.fn(),
    findOne: vi.fn(),
    findAll: vi.fn(),
    create: vi.fn(),
    build: vi.fn(),
    hasOne: vi.fn(),
    hasMany: vi.fn(),
    belongsTo: vi.fn(),
    belongsToMany: vi.fn(),
    associate: vi.fn(),
  };
  return mockModel;
};

export const MockUser = createMockModel() as unknown as typeof Model & {
  new (): Model;
  findOne: ReturnType<typeof vi.fn>;
  findAll: ReturnType<typeof vi.fn>;
  create: ReturnType<typeof vi.fn>;
  build: ReturnType<typeof vi.fn>;
  associate: ReturnType<typeof vi.fn>;
};

export const MockProvider = createMockModel() as unknown as typeof Model & {
  new (): Model;
  findOne: ReturnType<typeof vi.fn>;
  findAll: ReturnType<typeof vi.fn>;
  create: ReturnType<typeof vi.fn>;
  build: ReturnType<typeof vi.fn>;
  associate: ReturnType<typeof vi.fn>;
};

export const MockAd = createMockModel() as unknown as typeof Model & {
  new (): Model;
  findOne: ReturnType<typeof vi.fn>;
  findAll: ReturnType<typeof vi.fn>;
  create: ReturnType<typeof vi.fn>;
  build: ReturnType<typeof vi.fn>;
  associate: ReturnType<typeof vi.fn>;
};

export const mockUserInstance = {
  id: 1,
  email: 'test@example.com',
  hashedPassword: 'hashed-password',
  role: 'provider',
  reload: vi.fn(),
  save: vi.fn(),
};

export const mockProviderInstance = {
  id: 1,
  userId: 1,
  name: 'Test Provider',
  phone: '11999999999',
  whatsapp: '11999999999',
  neighborhood: 'Centro',
  city: 'São Paulo',
  reload: vi.fn(),
  save: vi.fn(),
};

export const mockAdInstance = {
  id: 1,
  providerId: 1,
  title: 'Test Ad',
  description: 'Test Description',
  category: 'reformas',
  status: 'activated',
  imageKey: null,
  imageUrl: null,
  reload: vi.fn(),
  save: vi.fn(),
};

export function resetMocks() {
  MockUser.findOne.mockReset();
  MockUser.findAll.mockReset();
  MockUser.create.mockReset();
  MockUser.build.mockReset();

  MockProvider.findOne.mockReset();
  MockProvider.findAll.mockReset();
  MockProvider.create.mockReset();
  MockProvider.build.mockReset();

  MockAd.findOne.mockReset();
  MockAd.findAll.mockReset();
  MockAd.create.mockReset();
  MockAd.build.mockReset();

  mockUserInstance.reload.mockReset();
  mockUserInstance.save.mockReset();
  mockProviderInstance.reload.mockReset();
  mockProviderInstance.save.mockReset();
  mockAdInstance.reload.mockReset();
  mockAdInstance.save.mockReset();
}
