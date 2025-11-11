import { Injectable } from '@nestjs/common';
import { CreateItemDto } from '../dtos/create-item.dto';
import { UpdateItemDto } from '../dtos/update-item.dto';
import { IItemRepository } from '../repositories/item.repository.interface';

@Injectable()
export class ItemService {
  constructor(private readonly itemRepository: IItemRepository) {}

  async create(createItemDto: CreateItemDto) {
    return this.itemRepository.create(createItemDto);
  }

  async findAll() {
    return this.itemRepository.findAll();
  }

  async findOne(id: number) {
    return this.itemRepository.findOne(id);
  }

  async update(id: number, updateItemDto: UpdateItemDto) {
    return this.itemRepository.update(id, updateItemDto);
  }

  async remove(id: number) {
    return this.itemRepository.remove(id);
  }
}
