import { Item } from '../entities/item.entity';
import { CreateItemDto } from '../dtos/create-item.dto';
import { UpdateItemDto } from '../dtos/update-item.dto';

export class ItemMapper {
  static toEntity(createItemDto: CreateItemDto): Partial<Item> {
    return {
      name: createItemDto.name,
      description: createItemDto.description,
    };
  }

  static toUpdateEntity(updateItemDto: UpdateItemDto): Partial<Item> {
    return {
      ...(updateItemDto.name && { name: updateItemDto.name }),
      ...(updateItemDto.description && {
        description: updateItemDto.description,
      }),
    };
  }

  static toDto(item: Item): Item {
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }
}
