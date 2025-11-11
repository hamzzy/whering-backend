import { Test, TestingModule } from '@nestjs/testing';
import { PinoLogger } from 'nestjs-pino';
import { ItemService } from './item.service';
import { IItemRepository } from '../repositories/item.repository.interface';
import { Item } from '../entities/item.entity';
import { ItemCategory } from '../entities/item.entity';
import { ItemNotFoundException } from '../../../common/exceptions/item-not-found.exception';
import { CreateItemDto } from '../dtos/create-item.dto';
import { UpdateItemDto } from '../dtos/update-item.dto';
import { QueryItemsDto } from '../dtos/query-items.dto';

describe('ItemService', () => {
  let service: ItemService;
  let repository: jest.Mocked<IItemRepository>;

  const mockItem: Item = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    category: ItemCategory.TOPS,
    colour: 'blue',
    user_id: 'user-123',
    brand: 'Brooks Brothers',
    size: 'M',
    image_url: 'https://example.com/shirt.jpg',
    purchase_date: new Date('2024-01-15'),
    purchase_price: 89.99,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  };

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const mockLogger = {
      setContext: jest.fn(),
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      log: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemService,
        {
          provide: 'IItemRepository',
          useValue: mockRepository,
        },
        {
          provide: PinoLogger,
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<ItemService>(ItemService);
    repository = module.get('IItemRepository');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an item', async () => {
      const createDto: CreateItemDto = {
        category: ItemCategory.TOPS,
        colour: 'blue',
        user_id: 'user-123',
        brand: 'Brooks Brothers',
        size: 'M',
        image_url: 'https://example.com/shirt.jpg',
        purchase_date: '2024-01-15',
        purchase_price: 89.99,
      };

      repository.create.mockResolvedValue(mockItem);

      const result = await service.create(createDto);

      expect(result).toEqual(mockItem);
      expect(repository.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return all items with query', async () => {
      const query: QueryItemsDto = {
        user_id: 'user-123',
        limit: 20,
        offset: 0,
      };

      repository.findAll.mockResolvedValue({
        data: [mockItem],
        count: 1,
      });

      const result = await service.findAll(query);

      expect(result.data).toHaveLength(1);
      expect(result.count).toBe(1);
      expect(repository.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('findOne', () => {
    it('should return an item by id', async () => {
      repository.findOne.mockResolvedValue(mockItem);

      const result = await service.findOne(mockItem.id);

      expect(result).toEqual(mockItem);
      expect(repository.findOne).toHaveBeenCalledWith(mockItem.id);
    });

    it('should throw ItemNotFoundException if item not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        ItemNotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update an item', async () => {
      const updateDto: UpdateItemDto = {
        colour: 'red',
      };

      const updatedItem = { ...mockItem, colour: 'red' };
      repository.findOne.mockResolvedValue(mockItem);
      repository.update.mockResolvedValue(updatedItem);

      const result = await service.update(mockItem.id, updateDto);

      expect(result.colour).toBe('red');
      expect(repository.update).toHaveBeenCalledWith(mockItem.id, updateDto);
    });

    it('should throw ItemNotFoundException if item not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(
        service.update('invalid-id', { colour: 'red' }),
      ).rejects.toThrow(ItemNotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove an item', async () => {
      repository.findOne.mockResolvedValue(mockItem);
      repository.remove.mockResolvedValue(undefined);

      await service.remove(mockItem.id);

      expect(repository.remove).toHaveBeenCalledWith(mockItem.id);
    });

    it('should throw ItemNotFoundException if item not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.remove('invalid-id')).rejects.toThrow(
        ItemNotFoundException,
      );
    });
  });
});
