import { vi } from 'vitest';

export function mockTransaction() {
  const transaction = {
    commit: vi.fn(),
    rollback: vi.fn(),
  };
  return transaction;
}
