import {
  IsEnum,
  IsString,
  IsNotEmpty,
  IsUrl,
  IsDateString,
  IsNumber,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ItemCategory } from '../entities/item.entity';

export class CreateItemDto {
  @ApiProperty({
    description: 'Category of the clothing item',
    enum: ItemCategory,
    example: ItemCategory.TOPS,
  })
  @IsEnum(ItemCategory)
  @IsNotEmpty()
  category: ItemCategory;

  @ApiProperty({
    description: 'Color of the clothing item',
    example: 'blue',
  })
  @IsString()
  @IsNotEmpty()
  colour: string;

  @ApiProperty({
    description: 'User ID who owns this item',
    example: 'user-123',
  })
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({
    description: 'Brand of the clothing item',
    example: 'Brooks Brothers',
  })
  @IsString()
  @IsNotEmpty()
  brand: string;

  @ApiProperty({
    description: 'Size of the clothing item',
    example: 'M',
  })
  @IsString()
  @IsNotEmpty()
  size: string;

  @ApiProperty({
    description: 'URL of the item image',
    example: 'https://example.com/shirt.jpg',
  })
  @IsUrl()
  @IsNotEmpty()
  image_url: string;

  @ApiProperty({
    description: 'Purchase date in ISO format',
    example: '2024-01-15',
  })
  @IsDateString()
  @IsNotEmpty()
  purchase_date: string;

  @ApiProperty({
    description: 'Purchase price in the currency unit',
    example: 89.99,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  purchase_price: number;
}
