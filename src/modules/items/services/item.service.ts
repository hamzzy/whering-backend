import {
  Injectable,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { CreateItemDto } from '../dtos/create-item.dto';
import { UpdateItemDto } from '../dtos/update-item.dto';
import { QueryItemsDto } from '../dtos/query-items.dto';
import {
  IItemRepository,
  FindAllResult,
} from '../repositories/item.repository.interface';
import { Item } from '../entities/item.entity';
import { ItemNotFoundException } from 'src/common/exceptions/item-not-found.exception';

@Injectable()
export class ItemService {
  constructor(
    @Inject('IItemRepository')
    private readonly itemRepository: IItemRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(ItemService.name);
  }

  async create(createItemDto: CreateItemDto): Promise<Item> {
    try {
      this.logger.debug({ createItemDto }, 'Creating new item');
      const item = await this.itemRepository.create(createItemDto);
      this.logger.info({ itemId: item.id }, 'Item created successfully');
      return item;
    } catch (error) {
      this.logger.error({ error, createItemDto }, 'Failed to create item');
      if (error instanceof ItemNotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create item');
    }
  }

  async findAll(query: QueryItemsDto): Promise<FindAllResult> {
    try {
      this.logger.debug({ query }, 'Finding all items with query');
      const result = await this.itemRepository.findAll(query);
      this.logger.info(
        { count: result.count, query },
        'Items retrieved successfully',
      );
      return result;
    } catch (error) {
      this.logger.error({ error, query }, 'Failed to find items');
      throw new InternalServerErrorException('Failed to retrieve items');
    }
  }

  async findOne(id: string): Promise<Item> {
    try {
      this.logger.debug({ itemId: id }, 'Finding item by ID');
      const item = await this.itemRepository.findOne(id);
      if (!item) {
        this.logger.warn({ itemId: id }, 'Item not found');
        throw new ItemNotFoundException(id);
      }
      this.logger.info({ itemId: id }, 'Item retrieved successfully');
      return item;
    } catch (error) {
      if (error instanceof ItemNotFoundException) {
        throw error;
      }
      this.logger.error({ error, itemId: id }, 'Failed to find item');
      throw new InternalServerErrorException('Failed to retrieve item');
    }
  }

  async update(id: string, updateItemDto: UpdateItemDto): Promise<Item> {
    try {
      this.logger.debug({ itemId: id, updateItemDto }, 'Updating item');
      const existingItem = await this.itemRepository.findOne(id);
      if (!existingItem) {
        this.logger.warn({ itemId: id }, 'Item not found for update');
        throw new ItemNotFoundException(id);
      }
      const updatedItem = await this.itemRepository.update(id, updateItemDto);
      this.logger.info({ itemId: id }, 'Item updated successfully');
      return updatedItem;
    } catch (error) {
      if (error instanceof ItemNotFoundException) {
        throw error;
      }
      this.logger.error(
        { error, itemId: id, updateItemDto },
        'Failed to update item',
      );
      throw new InternalServerErrorException('Failed to update item');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      this.logger.debug({ itemId: id }, 'Removing item');
      const existingItem = await this.itemRepository.findOne(id);
      if (!existingItem) {
        this.logger.warn({ itemId: id }, 'Item not found for deletion');
        throw new ItemNotFoundException(id);
      }
      await this.itemRepository.remove(id);
      this.logger.info({ itemId: id }, 'Item removed successfully');
    } catch (error) {
      if (error instanceof ItemNotFoundException) {
        throw error;
      }
      this.logger.error({ error, itemId: id }, 'Failed to remove item');
      throw new InternalServerErrorException('Failed to remove item');
    }
  }
}
