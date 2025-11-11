import { Item } from '../entities/item.entity';
import { CreateItemDto } from '../dtos/create-item.dto';
import { UpdateItemDto } from '../dtos/update-item.dto';
import { QueryItemsDto } from '../dtos/query-items.dto';

export interface FindAllResult {
  data: Item[];
  count: number;
}

export interface IItemRepository {
  create(createItemDto: CreateItemDto): Promise<Item>;
  findAll(query: QueryItemsDto): Promise<FindAllResult>;
  findOne(id: string): Promise<Item | null>;
  update(id: string, updateItemDto: UpdateItemDto): Promise<Item>;
  remove(id: string): Promise<void>;
}
