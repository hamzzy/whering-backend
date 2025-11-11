import { Item } from '../entities/item.entity';
import { CreateItemDto } from '../dtos/create-item.dto';
import { UpdateItemDto } from '../dtos/update-item.dto';

export interface IItemRepository {
  create(createItemDto: CreateItemDto): Promise<Item>;
  findAll(): Promise<Item[]>;
  findOne(id: number): Promise<Item | null>;
  update(id: number, updateItemDto: UpdateItemDto): Promise<Item>;
  remove(id: number): Promise<void>;
}
