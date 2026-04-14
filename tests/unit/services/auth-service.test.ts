import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UnprocessableEntityHttpError } from '../../../src/errors/unprocessable-entity-http-error';
import * as bcrypt from '../../../src/utils/bcrypt';
import {
  MockUser,
  MockProvider,
  mockUserInstance,
  mockProviderInstance,
  resetMocks,
} from '../../mocks/models';

vi.mock('../../../src/models/user', () => ({
  User: MockUser,
}));

vi.mock('../../../src/models/provider', () => ({
  Provider: MockProvider,
}));

const mockTransaction = {
  commit: vi.fn(),
  rollback: vi.fn(),
};

describe('AuthService', () => {
  beforeEach(() => {
    resetMocks();
  });

  describe('signup', () => {
    it('should throw error when passwords do not match', async () => {
      const { authService } = await import('../../../src/services/auth-service');
      
      const input = {
        email: 'test@example.com',
        password: 'password123',
        passwordConfirmation: 'differentpassword',
        name: 'Test User',
        phone: '11999999999',
        whatsapp: '11999999999',
        neighborhood: 'Centro',
        city: 'São Paulo',
      };

      await expect(authService.signup(mockTransaction as any, input)).rejects.toThrow(
        UnprocessableEntityHttpError
      );
      await expect(authService.signup(mockTransaction as any, input)).rejects.toThrow(
        'Senhas não batem'
      );
    });

    it('should throw error when email already exists', async () => {
      const { authService } = await import('../../../src/services/auth-service');
      
      const input = {
        email: 'existing@example.com',
        password: 'password123',
        passwordConfirmation: 'password123',
        name: 'Test User',
        phone: '11999999999',
        whatsapp: '11999999999',
        neighborhood: 'Centro',
        city: 'São Paulo',
      };

      MockUser.findOne.mockResolvedValue({ ...mockUserInstance, email: input.email });

      await expect(authService.signup(mockTransaction as any, input)).rejects.toThrow(
        UnprocessableEntityHttpError
      );
      await expect(authService.signup(mockTransaction as any, input)).rejects.toThrow(
        'Email já cadastrado'
      );
    });

    it('should create user and provider successfully', async () => {
      const { authService } = await import('../../../src/services/auth-service');
      
      const input = {
        email: 'new@example.com',
        password: 'password123',
        passwordConfirmation: 'password123',
        name: 'New User',
        phone: '11999999999',
        whatsapp: '11999999999',
        neighborhood: 'Centro',
        city: 'São Paulo',
      };

      const userInstance = { ...mockUserInstance, id: 1, email: input.email, reload: vi.fn() };
      const providerInstance = { ...mockProviderInstance, userId: 1 };

      MockUser.findOne.mockResolvedValue(null);
      MockUser.create.mockResolvedValue(userInstance);
      MockProvider.create.mockResolvedValue(providerInstance);
      userInstance.reload.mockResolvedValue(userInstance);

      const result = await authService.signup(mockTransaction as any, input);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(result.token).toBe('mock-jwt-token');
      expect(MockUser.create).toHaveBeenCalled();
      expect(MockProvider.create).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should throw error when email is not found', async () => {
      const { authService } = await import('../../../src/services/auth-service');
      
      const input = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      MockUser.findOne.mockResolvedValue(null);

      await expect(authService.login(input)).rejects.toThrow(
        UnprocessableEntityHttpError
      );
      await expect(authService.login(input)).rejects.toThrow(
        'E-mail não cadastrado'
      );
    });

    it('should throw error when password is incorrect', async () => {
      const { authService } = await import('../../../src/services/auth-service');
      
      const input = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const userInstance = { 
        ...mockUserInstance, 
        reload: vi.fn(),
        provider: mockProviderInstance,
      };
      MockUser.findOne.mockResolvedValue(userInstance);
      vi.mocked(bcrypt.compare).mockResolvedValue(false);

      await expect(authService.login(input)).rejects.toThrow(
        UnprocessableEntityHttpError
      );
      await expect(authService.login(input)).rejects.toThrow('Senha incorreta');
    });

    it('should return user and token on successful login', async () => {
      const { authService } = await import('../../../src/services/auth-service');
      
      const input = {
        email: 'test@example.com',
        password: 'correctpassword',
      };

      const userInstance = { 
        ...mockUserInstance, 
        reload: vi.fn(),
        provider: mockProviderInstance,
      };
      MockUser.findOne.mockResolvedValue(userInstance);
      vi.mocked(bcrypt.compare).mockResolvedValue(true);

      const result = await authService.login(input);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(result.token).toBe('mock-jwt-token');
    });
  });

  describe('me', () => {
    it('should throw error when user is not found', async () => {
      const { authService } = await import('../../../src/services/auth-service');
      
      MockUser.findOne.mockResolvedValue(null);

      await expect(authService.me(999)).rejects.toThrow(
        UnprocessableEntityHttpError
      );
      await expect(authService.me(999)).rejects.toThrow(
        'Usuário não encontrado'
      );
    });

    it('should return user when found', async () => {
      const { authService } = await import('../../../src/services/auth-service');
      
      const userInstance = { ...mockUserInstance, provider: mockProviderInstance };
      MockUser.findOne.mockResolvedValue(userInstance);

      const result = await authService.me(1);

      expect(result).toHaveProperty('user');
      expect(result.user.id).toBe(1);
    });
  });
});
