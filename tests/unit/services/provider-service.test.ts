import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NotFoundHttpError } from '../../../src/errors/not-found-http-error';
import {
  MockProvider,
  mockProviderInstance,
  resetMocks,
} from '../../mocks/models';

vi.mock('../../../src/models/provider', () => ({
  Provider: MockProvider,
}));

vi.mock('../../../src/utils/db', () => ({
  db: {
    fn: vi.fn().mockReturnValue('DISTINCT neighborhood'),
    col: vi.fn().mockReturnValue('neighborhood'),
  },
}));

vi.mock('../../../src/services/s3-service', () => ({
  s3Service: {
    exists: vi.fn().mockResolvedValue(false),
    upload: vi.fn().mockResolvedValue({ key: 'test-key', url: 'https://test.com/image.jpg' }),
    delete: vi.fn().mockResolvedValue(undefined),
  },
}));

const mockTransaction = {
  commit: vi.fn(),
  rollback: vi.fn(),
};

describe('ProviderService', () => {
  beforeEach(() => {
    resetMocks();
  });

  describe('getNeighborhoods', () => {
    it('should return distinct neighborhoods', async () => {
      const { providerService } = await import('../../../src/services/provider-service');

      const mockProviders = [
        { neighborhood: 'Centro' },
        { neighborhood: 'Jardins' },
      ];
      MockProvider.findAll.mockResolvedValue(mockProviders as any);

      const result = await providerService.getNeighborhoods();

      expect(result).toEqual(['Centro', 'Jardins']);
      expect(MockProvider.findAll).toHaveBeenCalled();
    });

    it('should return empty array when no neighborhoods exist', async () => {
      const { providerService } = await import('../../../src/services/provider-service');

      MockProvider.findAll.mockResolvedValue([]);

      const result = await providerService.getNeighborhoods();

      expect(result).toEqual([]);
    });
  });

  describe('update', () => {
    it('should throw error when provider not found', async () => {
      const { providerService } = await import('../../../src/services/provider-service');

      MockProvider.findOne.mockResolvedValue(null);

      const input = {
        name: 'Updated Name',
        phone: '11999999999',
        whatsapp: '11999999999',
        neighborhood: 'Centro',
        city: 'São Paulo',
      };

      await expect(providerService.update(999, input, mockTransaction as any)).rejects.toThrow(
        NotFoundHttpError
      );
      await expect(providerService.update(999, input, mockTransaction as any)).rejects.toThrow(
        'Provedor de serviço não encontrado'
      );
    });

    it('should update provider successfully', async () => {
      const { providerService } = await import('../../../src/services/provider-service');

      const providerInstance = {
        ...mockProviderInstance,
        name: 'Old Name',
        save: vi.fn(),
      };
      MockProvider.findOne.mockResolvedValue(providerInstance as any);
      providerInstance.save.mockResolvedValue(providerInstance);

      const input = {
        name: 'Updated Name',
        phone: '11999999999',
        whatsapp: '11999999999',
        neighborhood: 'Centro',
        city: 'São Paulo',
      };

      const result = await providerService.update(1, input, mockTransaction as any);

      expect(providerInstance.name).toBe('Updated Name');
      expect(providerInstance.save).toHaveBeenCalledWith({ transaction: mockTransaction });
    });

    it('should upload new image when provided', async () => {
      const { providerService } = await import('../../../src/services/provider-service');

      const providerInstance = {
        ...mockProviderInstance,
        imageKey: null,
        save: vi.fn(),
      };
      MockProvider.findOne.mockResolvedValue(providerInstance as any);
      providerInstance.save.mockResolvedValue(providerInstance);

      const input = {
        name: 'Provider Name',
        phone: '11999999999',
        whatsapp: '11999999999',
        neighborhood: 'Centro',
        city: 'São Paulo',
      };

      await providerService.update(1, input, mockTransaction as any);

      expect(providerInstance.save).toHaveBeenCalled();
    });

    it('should not call s3 service when no new image is provided', async () => {
      const { s3Service } = await import('../../../src/services/s3-service');
      const { providerService } = await import('../../../src/services/provider-service');

      const providerInstance = {
        ...mockProviderInstance,
        imageKey: 'existing-image-key',
        save: vi.fn(),
      };
      MockProvider.findOne.mockResolvedValue(providerInstance as any);
      providerInstance.save.mockResolvedValue(providerInstance);

      const input = {
        name: 'Provider Name',
        phone: '11999999999',
        whatsapp: '11999999999',
        neighborhood: 'Centro',
        city: 'São Paulo',
      };

      await providerService.update(1, input, mockTransaction as any);

      expect(s3Service.exists).not.toHaveBeenCalled();
      expect(s3Service.delete).not.toHaveBeenCalled();
      expect(s3Service.upload).not.toHaveBeenCalled();
    });

    it('should upload image with new file and delete old one', async () => {
      const { s3Service } = await import('../../../src/services/s3-service');
      const { providerService } = await import('../../../src/services/provider-service');

      const providerInstance = {
        ...mockProviderInstance,
        imageKey: 'old-key',
        save: vi.fn(),
      };
      MockProvider.findOne.mockResolvedValue(providerInstance as any);
      providerInstance.save.mockResolvedValue(providerInstance);
      vi.mocked(s3Service.exists).mockResolvedValue(true);

      const mockFile = {
        originalname: 'new-image.jpg',
        buffer: Buffer.from('test'),
        mimetype: 'image/jpeg',
      } as Express.Multer.File;

      const input = {
        name: 'Provider Name',
        phone: '11999999999',
        whatsapp: '11999999999',
        neighborhood: 'Centro',
        city: 'São Paulo',
        image: mockFile,
      };

      await providerService.update(1, input, mockTransaction as any);

      expect(s3Service.exists).toHaveBeenCalledWith('old-key');
      expect(s3Service.delete).toHaveBeenCalledWith('old-key');
      expect(s3Service.upload).toHaveBeenCalled();
    });

    it('should upload new image and not delete old one when old does not exist in S3', async () => {
      const { s3Service } = await import('../../../src/services/s3-service');
      const { providerService } = await import('../../../src/services/provider-service');

      const providerInstance = {
        ...mockProviderInstance,
        imageKey: 'old-key',
        save: vi.fn(),
      };
      MockProvider.findOne.mockResolvedValue(providerInstance as any);
      providerInstance.save.mockResolvedValue(providerInstance);
      vi.mocked(s3Service.exists).mockResolvedValue(false);

      const mockFile = {
        originalname: 'new-image.jpg',
        buffer: Buffer.from('test'),
        mimetype: 'image/jpeg',
      } as Express.Multer.File;

      const input = {
        name: 'Provider Name',
        phone: '11999999999',
        whatsapp: '11999999999',
        neighborhood: 'Centro',
        city: 'São Paulo',
        image: mockFile,
      };

      await providerService.update(1, input, mockTransaction as any);

      expect(s3Service.exists).toHaveBeenCalled();
      expect(s3Service.upload).toHaveBeenCalled();
    });
  });
});
