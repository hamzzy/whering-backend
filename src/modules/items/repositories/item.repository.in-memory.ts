import { Injectable } from '@nestjs/common';
import { Item } from '../entities/item.entity';
import { CreateItemDto } from '../dtos/create-item.dto';
import { UpdateItemDto } from '../dtos/update-item.dto';
import { IItemRepository } from './item.repository.interface';

@Injectable()
export class InMemoryItemRepository implements IItemRepository {
  private items: Item[] = [];
  private nextId = 1;

  async create(createItemDto: CreateItemDto): Promise<Item> {
    const item: Item = {
      id: this.nextId++,
      ...createItemDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.items.push(item);
    return item;
  }

  async findAll(): Promise<Item[]> {
    return [...this.items];
  }

  async findOne(id: number): Promise<Item | null> {
    return this.items.find((item) => item.id === id) || null;
  }

  async update(id: number, updateItemDto: UpdateItemDto): Promise<Item> {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error(`Item with id ${id} not found`);
    }
    this.items[index] = {
      ...this.items[index],
      ...updateItemDto,
      updatedAt: new Date(),
    };
    return this.items[index];
  }

  async remove(id: number): Promise<void> {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error(`Item with id ${id} not found`);
    }
    this.items.splice(index, 1);
  }
}
