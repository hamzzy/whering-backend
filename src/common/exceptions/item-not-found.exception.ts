import { NotFoundException } from '@nestjs/common';

export class ItemNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Item with id ${id} not found`);
  }
}
