import { Test, TestingModule } from '@nestjs/testing';
import { ItemController } from './item.controller';
import { ItemService } from '../services/item.service';
import { Item } from '../entities/item.entity';
import { ItemCategory } from '../entities/item.entity';
import { CreateItemDto } from '../dtos/create-item.dto';

describe('ItemController', () => {
  let controller: ItemController;
  let service: jest.Mocked<ItemService>;

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
  };

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemController],
      providers: [
        {
          provide: ItemService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ItemController>(ItemController);
    service = module.get(ItemService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

      service.create.mockResolvedValue(mockItem);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockItem);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return all items', async () => {
      service.findAll.mockResolvedValue({
        data: [mockItem],
        count: 1,
      });

      const result = await controller.findAll({});

      expect(result.data).toHaveLength(1);
      expect(result.count).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return an item by id', async () => {
      service.findOne.mockResolvedValue(mockItem);

      const result = await controller.findOne(mockItem.id);

      expect(result).toEqual(mockItem);
      expect(service.findOne).toHaveBeenCalledWith(mockItem.id);
    });
  });
});
