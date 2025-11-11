import {
  IsOptional,
  IsString,
  IsEnum,
  IsInt,
  Min,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ItemCategory } from '../entities/item.entity';

export class QueryItemsDto {
  @ApiPropertyOptional({
    description: 'Filter by user ID',
    example: 'user-123',
  })
  @IsOptional()
  @IsString()
  user_id?: string;

  @ApiPropertyOptional({
    description: 'Filter by category',
    enum: ItemCategory,
    example: ItemCategory.TOPS,
  })
  @IsOptional()
  @IsEnum(ItemCategory)
  category?: ItemCategory;

  @ApiPropertyOptional({
    description: 'Maximum number of items to return',
    example: 20,
    default: 20,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(0)
  limit?: number = 20;

  @ApiPropertyOptional({
    description: 'Number of items to skip',
    example: 0,
    default: 0,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(0)
  offset?: number = 0;

  @ApiPropertyOptional({
    description: 'Field to sort by',
    enum: ['purchase_date', 'brand', 'purchase_price'],
    example: 'purchase_date',
    default: 'purchase_date',
  })
  @IsOptional()
  @IsString()
  @IsIn(['purchase_date', 'brand', 'purchase_price'])
  sort_by?: 'purchase_date' | 'brand' | 'purchase_price' = 'purchase_date';

  @ApiPropertyOptional({
    description: 'Sort order',
    enum: ['asc', 'desc'],
    example: 'desc',
    default: 'desc',
  })
  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  sort_order?: 'asc' | 'desc' = 'desc';
}
