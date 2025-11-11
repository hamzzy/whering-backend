import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { ItemService } from './services/item.service';
import { ItemController } from './controllers/item.controller';
import { InMemoryItemRepository } from './repositories/item.repository.in-memory';

@Module({
  imports: [LoggerModule],
  controllers: [ItemController],
  providers: [
    {
      provide: 'IItemRepository',
      useClass: InMemoryItemRepository,
    },
    ItemService,
  ],
  exports: [ItemService],
})
export class ItemModule {}
