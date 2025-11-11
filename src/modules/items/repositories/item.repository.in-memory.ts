import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Item } from '../entities/item.entity';
import { CreateItemDto } from '../dtos/create-item.dto';
import { UpdateItemDto } from '../dtos/update-item.dto';
import { QueryItemsDto } from '../dtos/query-items.dto';
import { IItemRepository, FindAllResult } from './item.repository.interface';
import { ItemNotFoundException } from '../../../common/exceptions/item-not-found.exception';

@Injectable()
export class InMemoryItemRepository implements IItemRepository {
  private items: Item[] = [];

  async create(createItemDto: CreateItemDto): Promise<Item> {
    const now = new Date();
    const item: Item = {
      id: uuidv4(),
      category: createItemDto.category,
      colour: createItemDto.colour,
      user_id: createItemDto.user_id,
      brand: createItemDto.brand,
      size: createItemDto.size,
      image_url: createItemDto.image_url,
      purchase_date: new Date(createItemDto.purchase_date),
      purchase_price: createItemDto.purchase_price,
      createdAt: now,
      updatedAt: now,
    };
    this.items.push(item);
    return item;
  }

  async findAll(query: QueryItemsDto): Promise<FindAllResult> {
    let filtered = [...this.items];

    // Filter by user_id
    if (query.user_id) {
      filtered = filtered.filter((item) => item.user_id === query.user_id);
    }

    // Filter by category
    if (query.category) {
      filtered = filtered.filter((item) => item.category === query.category);
    }

    // Sort
    const sortBy = query.sort_by || 'purchase_date';
    const sortOrder = query.sort_order || 'desc';

    filtered.sort((a, b) => {
      let aValue: string | number | Date;
      let bValue: string | number | Date;

      if (sortBy === 'purchase_date') {
        aValue = a.purchase_date;
        bValue = b.purchase_date;
      } else if (sortBy === 'brand') {
        aValue = a.brand.toLowerCase();
        bValue = b.brand.toLowerCase();
      } else {
        aValue = a.purchase_price;
        bValue = b.purchase_price;
      }

      if (aValue < bValue) {
        return sortOrder === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });

    // Pagination
    const offset = query.offset || 0;
    const limit = query.limit || 20;
    const paginated = filtered.slice(offset, offset + limit);

    return {
      data: paginated,
      count: filtered.length,
    };
  }

  async findOne(id: string): Promise<Item | null> {
    return this.items.find((item) => item.id === id) || null;
  }

  async update(id: string, updateItemDto: UpdateItemDto): Promise<Item> {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new ItemNotFoundException(id);
    }

    const existingItem = this.items[index];
    const updatedItem: Item = {
      ...existingItem,
      ...(updateItemDto.category && { category: updateItemDto.category }),
      ...(updateItemDto.colour && { colour: updateItemDto.colour }),
      ...(updateItemDto.user_id && { user_id: updateItemDto.user_id }),
      ...(updateItemDto.brand && { brand: updateItemDto.brand }),
      ...(updateItemDto.size && { size: updateItemDto.size }),
      ...(updateItemDto.image_url && { image_url: updateItemDto.image_url }),
      ...(updateItemDto.purchase_date && {
        purchase_date: new Date(updateItemDto.purchase_date),
      }),
      ...(updateItemDto.purchase_price !== undefined && {
        purchase_price: updateItemDto.purchase_price,
      }),
      updatedAt: new Date(),
    };

    this.items[index] = updatedItem;
    return updatedItem;
  }

  async remove(id: string): Promise<void> {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new ItemNotFoundException(id);
    }
    this.items.splice(index, 1);
  }
}
