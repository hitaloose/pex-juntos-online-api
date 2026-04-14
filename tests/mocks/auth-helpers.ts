import { encode } from '../../src/utils/jwt';
import { Role } from '../../src/types/role';

interface AuthTokenPayload {
  userId: number;
  role: Role;
}

export function generateToken(payload: AuthTokenPayload): string {
  return encode(payload.userId);
}

export function createAuthHeaders(userId: number = 1, role: Role = Role.PROVIDER): Record<string, string> {
  const token = generateToken({ userId, role });
  return {
    Authorization: `Bearer ${token}`,
  };
}
