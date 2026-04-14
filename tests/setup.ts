import { vi } from 'vitest';

const mockSequelizeInstance = {
  define: vi.fn().mockReturnValue({
    init: vi.fn(),
    hasOne: vi.fn(),
    hasMany: vi.fn(),
    belongsTo: vi.fn(),
    belongsToMany: vi.fn(),
  }),
  transaction: vi.fn().mockResolvedValue({
    commit: vi.fn(),
    rollback: vi.fn(),
  }),
  authenticate: vi.fn(),
};

vi.mock('../src/utils/db', () => ({
  db: mockSequelizeInstance,
  assertDatabaseConnectionOk: vi.fn(),
  setupDb: vi.fn(),
}));

vi.mock('../src/utils/jwt', () => ({
  encode: vi.fn().mockReturnValue('mock-jwt-token'),
  decode: vi.fn().mockReturnValue(1),
}));

vi.mock('../src/utils/bcrypt', () => ({
  hash: vi.fn().mockResolvedValue('hashed-password'),
  compare: vi.fn(),
}));

vi.mock('../src/config', () => ({
  CONFIG: {
    JWT_SECRET: 'test-secret',
    DB_DIALECT: 'sqlite',
    DB_STORAGE: ':memory:',
    DB_NAME: 'test',
    DB_USERNAME: 'test',
    DB_PASSWORD: 'test',
    DB_HOST: 'localhost',
    DB_PORT: 5432,
    AWS_BUCKET: 'test-bucket',
    AWS_REGION: 'us-east-1',
    AWS_ACCESS_KEY: 'test-key',
    AWS_SECRET_KEY: 'test-secret',
  },
}));
