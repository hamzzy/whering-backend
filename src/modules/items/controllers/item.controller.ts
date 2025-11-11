import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { ItemService } from '../services/item.service';
import { CreateItemDto } from '../dtos/create-item.dto';
import { UpdateItemDto } from '../dtos/update-item.dto';
import { QueryItemsDto } from '../dtos/query-items.dto';
import { ItemDto, ItemResponseDto } from '../dtos/item-response.dto';

@ApiTags('items')
@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new clothing item' })
  @ApiCreatedResponse({
    description: 'The item has been successfully created.',
    type: ItemDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data.' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createItemDto: CreateItemDto) {
    return this.itemService.create(createItemDto);
  }

  @Get()
  @ApiOperation({
    summary: 'List all clothing items with filtering, pagination, and sorting',
  })
  @ApiOkResponse({
    description: 'List of items retrieved successfully.',
    type: ItemResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: QueryItemsDto) {
    const result = await this.itemService.findAll(query);
    return {
      data: result.data,
      count: result.count,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single item by ID' })
  @ApiParam({
    name: 'id',
    description: 'Item ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiOkResponse({
    description: 'Item retrieved successfully.',
    type: ItemDto,
  })
  @ApiNotFoundResponse({ description: 'Item not found.' })
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    return this.itemService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing item' })
  @ApiParam({
    name: 'id',
    description: 'Item ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiOkResponse({
    description: 'Item updated successfully.',
    type: ItemDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data.' })
  @ApiNotFoundResponse({ description: 'Item not found.' })
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemService.update(id, updateItemDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an item' })
  @ApiParam({
    name: 'id',
    description: 'Item ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiNoContentResponse({ description: 'Item deleted successfully.' })
  @ApiNotFoundResponse({ description: 'Item not found.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.itemService.remove(id);
  }
}
