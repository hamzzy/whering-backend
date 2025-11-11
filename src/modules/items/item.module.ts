import { Module } from '@nestjs/common';
import { ItemService } from './services/item.service';
import { ItemController } from './controllers/item.controller';
import { InMemoryItemRepository } from './repositories/item.repository.in-memory';
import { IItemRepository } from './repositories/item.repository.interface';

@Module({
  controllers: [ItemController],
  providers: [
    {
      provide: 'IItemRepository',
      useClass: InMemoryItemRepository,
    },
    {
      provide: ItemService,
      useFactory: (repository: IItemRepository) => {
        return new ItemService(repository);
      },
      inject: ['IItemRepository'],
    },
  ],
  exports: [ItemService],
})
export class ItemModule {}
