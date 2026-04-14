import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NotFoundHttpError } from '../../../src/errors/not-found-http-error';
import { UnprocessableEntityHttpError } from '../../../src/errors/unprocessable-entity-http-error';
import {
  MockUser,
  MockProvider,
  MockAd,
  mockUserInstance,
  mockProviderInstance,
  mockAdInstance,
  resetMocks,
} from '../../mocks/models';

vi.mock('../../../src/models/user', () => ({
  User: MockUser,
}));

vi.mock('../../../src/models/provider', () => ({
  Provider: MockProvider,
}));

vi.mock('../../../src/models/ad', () => ({
  Ad: MockAd,
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

describe('AdService', () => {
  beforeEach(() => {
    resetMocks();
  });

  describe('search', () => {
    it('should return only activated ads', async () => {
      const { adService } = await import('../../../src/services/ad-service');
      
      const mockAds = [
        { ...mockAdInstance, id: 1 },
        { ...mockAdInstance, id: 2 },
      ];
      MockAd.findAll.mockResolvedValue(mockAds as any);

      const result = await adService.search({});

      expect(MockAd.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status: 'activated' }),
        })
      );
      expect(result).toHaveLength(2);
    });

    it('should filter by category', async () => {
      const { adService } = await import('../../../src/services/ad-service');
      
      MockAd.findAll.mockResolvedValue([]);

      await adService.search({ category: 'reformas' });

      expect(MockAd.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ category: 'reformas' }),
        })
      );
    });

    it('should filter by neighborhood', async () => {
      const { adService } = await import('../../../src/services/ad-service');
      
      MockAd.findAll.mockResolvedValue([]);

      await adService.search({ neighborhood: 'Centro' });

      expect(MockAd.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          include: expect.arrayContaining([
            expect.objectContaining({
              where: expect.objectContaining({ neighborhood: 'Centro' }),
            }),
          ]),
        })
      );
    });
  });

  describe('getAll', () => {
    it('should throw error when user is provider but not found', async () => {
      const { adService } = await import('../../../src/services/ad-service');
      
      MockProvider.findOne.mockResolvedValue(null);

      await expect(adService.getAll(1)).rejects.toThrow(NotFoundHttpError);
      await expect(adService.getAll(1)).rejects.toThrow(
        'Prestador de serviço não encontrado'
      );
    });

    it('should return ads for authenticated provider', async () => {
      const { adService } = await import('../../../src/services/ad-service');
      
      const providerInstance = { ...mockProviderInstance, id: 1 };
      const ads = [{ ...mockAdInstance, providerId: providerInstance.id }];
      
      MockProvider.findOne.mockResolvedValue(providerInstance as any);
      MockAd.findAll.mockResolvedValue(ads as any);

      const result = await adService.getAll(1);

      expect(result).toHaveLength(1);
      expect(MockAd.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            providerId: providerInstance.id,
          }),
        })
      );
    });

    it('should return all ads for admin', async () => {
      const { adService } = await import('../../../src/services/ad-service');
      
      const ads = [{ ...mockAdInstance, id: 1 }, { ...mockAdInstance, id: 2 }];
      MockAd.findAll.mockResolvedValue(ads as any);

      const result = await adService.getAll();

      expect(result).toHaveLength(2);
      expect(MockProvider.findOne).not.toHaveBeenCalled();
    });
  });

  describe('get', () => {
    it('should throw error when ad is not found', async () => {
      const { adService } = await import('../../../src/services/ad-service');
      
      MockAd.findOne.mockResolvedValue(null);

      await expect(adService.get(999)).rejects.toThrow(NotFoundHttpError);
      await expect(adService.get(999)).rejects.toThrow(
        'Anúncio não encontrado'
      );
    });

    it('should return ad when found', async () => {
      const { adService } = await import('../../../src/services/ad-service');
      
      const adInstance = { ...mockAdInstance, id: 1 };
      MockAd.findOne.mockResolvedValue(adInstance as any);

      const result = await adService.get(1);

      expect(result.id).toBe(1);
    });
  });

  describe('create', () => {
    it('should throw error when provider not found', async () => {
      const { adService } = await import('../../../src/services/ad-service');
      
      MockProvider.findOne.mockResolvedValue(null);

      const input = {
        title: 'Test Ad',
        description: 'Test Description',
        category: 'reformas',
      };

      await expect(adService.create(1, input, mockTransaction as any)).rejects.toThrow(
        NotFoundHttpError
      );
    });

    it('should throw error when category is invalid', async () => {
      const { adService } = await import('../../../src/services/ad-service');
      
      MockProvider.findOne.mockResolvedValue(mockProviderInstance as any);

      const input = {
        title: 'Test Ad',
        description: 'Test Description',
        category: 'invalid-category',
      };

      await expect(adService.create(1, input, mockTransaction as any)).rejects.toThrow(
        NotFoundHttpError
      );
    });
  });

  describe('toggleStatus', () => {
    it('should throw error when provider not found', async () => {
      const { adService } = await import('../../../src/services/ad-service');
      
      MockProvider.findOne.mockResolvedValue(null);

      await expect(adService.toggleStatus(1, 1)).rejects.toThrow(
        NotFoundHttpError
      );
    });

    it('should throw error when ad not found', async () => {
      const { adService } = await import('../../../src/services/ad-service');
      
      MockProvider.findOne.mockResolvedValue(mockProviderInstance as any);
      MockAd.findOne.mockResolvedValue(null);

      await expect(adService.toggleStatus(1, 999)).rejects.toThrow(
        NotFoundHttpError
      );
    });

    it('should toggle ad status from activated to disabled', async () => {
      const { adService } = await import('../../../src/services/ad-service');
      
      const adInstance = { ...mockAdInstance, status: 'activated', save: vi.fn() };
      MockProvider.findOne.mockResolvedValue(mockProviderInstance as any);
      MockAd.findOne.mockResolvedValue(adInstance as any);

      await adService.toggleStatus(1, 1);

      expect(adInstance.status).toBe('disabled');
    });

    it('should toggle ad status from disabled to activated', async () => {
      const { adService } = await import('../../../src/services/ad-service');
      
      const adInstance = { ...mockAdInstance, status: 'disabled', save: vi.fn() };
      MockProvider.findOne.mockResolvedValue(mockProviderInstance as any);
      MockAd.findOne.mockResolvedValue(adInstance as any);

      await adService.toggleStatus(1, 1);

      expect(adInstance.status).toBe('activated');
    });

    it('should throw error when ad is hidden by admin', async () => {
      const { adService } = await import('../../../src/services/ad-service');
      
      const adInstance = { ...mockAdInstance, status: 'hidden' };
      MockProvider.findOne.mockResolvedValue(mockProviderInstance as any);
      MockAd.findOne.mockResolvedValue(adInstance as any);

      await expect(adService.toggleStatus(1, 1)).rejects.toThrow(
        UnprocessableEntityHttpError
      );
      await expect(adService.toggleStatus(1, 1)).rejects.toThrow(
        'Anúncio oculto pelo administrador'
      );
    });
  });

  describe('delete', () => {
    it('should throw error when provider not found', async () => {
      const { adService } = await import('../../../src/services/ad-service');
      
      MockProvider.findOne.mockResolvedValue(null);

      await expect(adService.delete(1, 1)).rejects.toThrow(NotFoundHttpError);
    });

    it('should throw error when ad not found', async () => {
      const { adService } = await import('../../../src/services/ad-service');
      
      MockProvider.findOne.mockResolvedValue(mockProviderInstance as any);
      MockAd.findOne.mockResolvedValue(null);

      await expect(adService.delete(1, 999)).rejects.toThrow(NotFoundHttpError);
    });

    it('should mark ad as removed', async () => {
      const { adService } = await import('../../../src/services/ad-service');
      
      const adInstance = { ...mockAdInstance, status: 'activated', save: vi.fn() };
      MockProvider.findOne.mockResolvedValue(mockProviderInstance as any);
      MockAd.findOne.mockResolvedValue(adInstance as any);

      await adService.delete(1, 1);

      expect(adInstance.status).toBe('removed');
      expect(adInstance.save).toHaveBeenCalled();
    });
  });

  describe('toggleHide', () => {
    it('should throw error when ad not found', async () => {
      const { adService } = await import('../../../src/services/ad-service');
      
      MockAd.findOne.mockResolvedValue(null);

      await expect(adService.toggleHide(999)).rejects.toThrow(NotFoundHttpError);
      await expect(adService.toggleHide(999)).rejects.toThrow('Anúncio não encontrado');
    });

    it('should hide ad when status is activated', async () => {
      const { adService } = await import('../../../src/services/ad-service');
      
      const adInstance = { ...mockAdInstance, status: 'activated', save: vi.fn() };
      MockAd.findOne.mockResolvedValue(adInstance as any);

      await adService.toggleHide(1);

      expect(adInstance.status).toBe('hidden');
      expect(adInstance.save).toHaveBeenCalled();
    });

    it('should unhide ad when status is hidden', async () => {
      const { adService } = await import('../../../src/services/ad-service');
      
      const adInstance = { ...mockAdInstance, status: 'hidden', save: vi.fn() };
      MockAd.findOne.mockResolvedValue(adInstance as any);

      await adService.toggleHide(1);

      expect(adInstance.status).toBe('activated');
      expect(adInstance.save).toHaveBeenCalled();
    });
  });

  describe('search with query', () => {
    it('should filter ads by search query', async () => {
      const { adService } = await import('../../../src/services/ad-service');
      
      const mockAds = [{ ...mockAdInstance }];
      MockAd.findAll.mockResolvedValue(mockAds as any);

      const result = await adService.search({ q: 'test query' });

      expect(result).toHaveLength(1);
      expect(MockAd.findAll).toHaveBeenCalled();
    });

    it('should handle query with only whitespace as empty', async () => {
      const { adService } = await import('../../../src/services/ad-service');
      
      const mockAds = [{ ...mockAdInstance }];
      MockAd.findAll.mockResolvedValue(mockAds as any);

      const result = await adService.search({ q: '   ' });

      expect(MockAd.findAll).toHaveBeenCalled();
    });

    it('should filter by neighborhood', async () => {
      const { adService } = await import('../../../src/services/ad-service');
      
      const mockAds = [{ ...mockAdInstance }];
      MockAd.findAll.mockResolvedValue(mockAds as any);

      const result = await adService.search({ neighborhood: 'Centro' });

      expect(result).toHaveLength(1);
      expect(MockAd.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          include: expect.arrayContaining([
            expect.objectContaining({
              where: expect.objectContaining({ neighborhood: 'Centro' }),
            }),
          ]),
        })
      );
    });

    it('should filter by providerId', async () => {
      const { adService } = await import('../../../src/services/ad-service');
      
      const mockAds = [{ ...mockAdInstance }];
      MockAd.findAll.mockResolvedValue(mockAds as any);

      const result = await adService.search({ providerId: 1 });

      expect(result).toHaveLength(1);
      expect(MockAd.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ providerId: 1 }),
        })
      );
    });
  });

  describe('create with image upload', () => {
    it('should create ad without image', async () => {
      const { adService } = await import('../../../src/services/ad-service');
      
      const providerInstance = { ...mockProviderInstance, id: 1 };
      const adInstance = {
        ...mockAdInstance,
        providerId: providerInstance.id,
        save: vi.fn(),
        reload: vi.fn(),
      };
      
      MockProvider.findOne.mockResolvedValue(providerInstance as any);
      MockAd.build.mockReturnValue(adInstance as any);
      adInstance.save.mockResolvedValue(adInstance);
      adInstance.reload.mockResolvedValue(adInstance);

      const input = {
        title: 'Test Ad',
        description: 'Test Description',
        category: 'costura',
      };

      const result = await adService.create(1, input, mockTransaction as any);

      expect(MockAd.build).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test Ad',
          category: 'costura',
          status: 'activated',
        })
      );
      expect(adInstance.save).toHaveBeenCalled();
    });

    it('should create ad with image upload', async () => {
      const { adService } = await import('../../../src/services/ad-service');
      const { s3Service } = await import('../../../src/services/s3-service');
      
      const providerInstance = { ...mockProviderInstance, id: 1 };
      const adInstance = {
        ...mockAdInstance,
        providerId: providerInstance.id,
        imageKey: null,
        save: vi.fn(),
        reload: vi.fn(),
      };
      
      MockProvider.findOne.mockResolvedValue(providerInstance as any);
      MockAd.build.mockReturnValue(adInstance as any);
      adInstance.save.mockResolvedValue(adInstance);
      adInstance.reload.mockResolvedValue(adInstance);

      const mockFile = {
        originalname: 'test-image.jpg',
        buffer: Buffer.from('test'),
        mimetype: 'image/jpeg',
      } as Express.Multer.File;

      const input = {
        title: 'Test Ad',
        description: 'Test Description',
        category: 'costura',
        image: mockFile,
      };

      await adService.create(1, input, mockTransaction as any);

      expect(s3Service.upload).toHaveBeenCalled();
      expect(adInstance.imageKey).toBeDefined();
    });

    it('should delete old image when updating ad with new image', async () => {
      const { adService } = await import('../../../src/services/ad-service');
      const { s3Service } = await import('../../../src/services/s3-service');
      
      const providerInstance = { ...mockProviderInstance, id: 1 };
      const adInstance = {
        ...mockAdInstance,
        providerId: providerInstance.id,
        imageKey: 'old-image-key',
        save: vi.fn(),
        reload: vi.fn(),
      };
      
      MockProvider.findOne.mockResolvedValue(providerInstance as any);
      MockAd.findOne.mockResolvedValue(adInstance as any);
      adInstance.save.mockResolvedValue(adInstance);
      adInstance.reload.mockResolvedValue(adInstance);
      vi.mocked(s3Service.exists).mockResolvedValue(true);

      const mockFile = {
        originalname: 'new-image.jpg',
        buffer: Buffer.from('test'),
        mimetype: 'image/jpeg',
      } as Express.Multer.File;

      const input = {
        title: 'Updated Ad',
        description: 'Updated Description',
        category: 'costura',
        image: mockFile,
      };

      await adService.update(1, 1, input, mockTransaction as any);

      expect(s3Service.exists).toHaveBeenCalledWith('old-image-key');
      expect(s3Service.delete).toHaveBeenCalledWith('old-image-key');
      expect(s3Service.upload).toHaveBeenCalled();
    });
  });
});
