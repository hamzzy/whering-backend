import { PartialType } from '@nestjs/swagger';
import { CreateItemDto } from './create-item.dto';
import {
  IsEnum,
  IsString,
  IsUrl,
  IsDateString,
  IsNumber,
  Min,
  IsOptional,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ItemCategory } from '../entities/item.entity';

export class UpdateItemDto extends PartialType(CreateItemDto) {
  @ApiPropertyOptional({
    description: 'Category of the clothing item',
    enum: ItemCategory,
    example: ItemCategory.TOPS,
  })
  @IsEnum(ItemCategory)
  @IsOptional()
  category?: ItemCategory;

  @ApiPropertyOptional({
    description: 'Color of the clothing item',
    example: 'blue',
  })
  @IsString()
  @IsOptional()
  colour?: string;

  @ApiPropertyOptional({
    description: 'User ID who owns this item',
    example: 'user-123',
  })
  @IsString()
  @IsOptional()
  user_id?: string;

  @ApiPropertyOptional({
    description: 'Brand of the clothing item',
    example: 'Brooks Brothers',
  })
  @IsString()
  @IsOptional()
  brand?: string;

  @ApiPropertyOptional({
    description: 'Size of the clothing item',
    example: 'M',
  })
  @IsString()
  @IsOptional()
  size?: string;

  @ApiPropertyOptional({
    description: 'URL of the item image',
    example: 'https://example.com/shirt.jpg',
  })
  @IsUrl()
  @IsOptional()
  image_url?: string;

  @ApiPropertyOptional({
    description: 'Purchase date in ISO format',
    example: '2024-01-15',
  })
  @IsDateString()
  @IsOptional()
  purchase_date?: string;

  @ApiPropertyOptional({
    description: 'Purchase price in the currency unit',
    example: 89.99,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  purchase_price?: number;
}
