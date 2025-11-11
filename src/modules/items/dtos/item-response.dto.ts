import { ApiProperty } from '@nestjs/swagger';

export class ItemDto {
  @ApiProperty({
    description: 'Unique identifier for the item',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Category of the clothing item',
    enum: ['tops', 'bottoms', 'dresses', 'outerwear', 'shoes', 'accessories'],
    example: 'tops',
  })
  category: string;

  @ApiProperty({
    description: 'Color of the clothing item',
    example: 'blue',
  })
  colour: string;

  @ApiProperty({
    description: 'User ID who owns this item',
    example: 'user-123',
  })
  user_id: string;

  @ApiProperty({
    description: 'Brand of the clothing item',
    example: 'Brooks Brothers',
  })
  brand: string;

  @ApiProperty({
    description: 'Size of the clothing item',
    example: 'M',
  })
  size: string;

  @ApiProperty({
    description: 'URL of the item image',
    example: 'https://example.com/shirt.jpg',
  })
  image_url: string;

  @ApiProperty({
    description: 'Purchase date',
    example: '2024-01-15T00:00:00.000Z',
  })
  purchase_date: Date;

  @ApiProperty({
    description: 'Purchase price',
    example: 89.99,
  })
  purchase_price: number;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-15T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-15T00:00:00.000Z',
  })
  updatedAt: Date;
}

export class ItemResponseDto {
  @ApiProperty({
    description: 'List of clothing items',
    type: [ItemDto],
  })
  data: ItemDto[];

  @ApiProperty({
    description: 'Total count of items matching the query',
    example: 1,
  })
  count: number;
}
