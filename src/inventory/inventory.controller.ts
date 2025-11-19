import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, BadRequestException, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { CreateInventoryItemDto, UpdateInventoryItemDto, InventoryItemEntity } from './dto/inventory-item.dto';

@ApiTags('Inventory')
@ApiExtraModels(InventoryItemEntity)
@Controller('api/inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  @ApiOperation({ 
    summary: 'List all inventory items',
    description: 'Retrieve a complete list of all inventory items'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Successfully retrieved inventory items',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        count: { type: 'integer', example: 3 },
        data: {
          type: 'array',
          items: { $ref: getSchemaPath(InventoryItemEntity) }
        }
      }
    }
  })
  findAll() {
    const data = this.inventoryService.findAll();
    return { success: true, count: data.length, data };
  }

  @Get('search')
  @ApiOperation({ 
    summary: 'Search inventory items',
    description: 'Search for inventory items by name or description'
  })
  @ApiQuery({ 
    name: 'q', 
    required: true, 
    description: 'Search term to match against item name or description',
    example: 'laptop'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Successfully retrieved search results',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        count: { type: 'integer', example: 1 },
        data: {
          type: 'array',
          items: { $ref: getSchemaPath(InventoryItemEntity) }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Missing search query parameter',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        error: { type: 'string', example: 'Search query parameter "q" is required' }
      }
    }
  })
  search(@Query('q') query: string) {
    if (!query) {
      throw new BadRequestException('Search query parameter "q" is required');
    }
    const data = this.inventoryService.search(query);
    return { success: true, count: data.length, data };
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get a specific inventory item',
    description: 'Retrieve details of a single inventory item by its ID'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Unique identifier of the inventory item',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Successfully retrieved inventory item',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: { $ref: getSchemaPath(InventoryItemEntity) }
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Inventory item not found',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        error: { type: 'string', example: 'Inventory item with ID 1 not found' }
      }
    }
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    const data = this.inventoryService.findOne(id);
    return { success: true, data };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Create a new inventory item',
    description: 'Add a new item to the inventory'
  })
  @ApiBody({ type: CreateInventoryItemDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Inventory item created successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Inventory item created successfully' },
        data: { $ref: getSchemaPath(InventoryItemEntity) }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid input data',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        errors: { 
          type: 'array',
          items: { type: 'string' }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Internal server error'
  })
  async create(@Body() createDto: CreateInventoryItemDto) {
    const data = await this.inventoryService.create(createDto);
    return { success: true, message: 'Inventory item created successfully', data };
  }

  @Put(':id')
  @ApiOperation({ 
    summary: 'Update an existing inventory item',
    description: 'Update all fields of an existing inventory item'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Unique identifier of the inventory item',
    example: 1
  })
  @ApiBody({ type: UpdateInventoryItemDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Inventory item updated successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Inventory item updated successfully' },
        data: { $ref: getSchemaPath(InventoryItemEntity) }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid input data'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Inventory item not found'
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Internal server error'
  })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateInventoryItemDto) {
    const data = await this.inventoryService.update(id, updateDto);
    return { success: true, message: 'Inventory item updated successfully', data };
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Delete an inventory item',
    description: 'Remove an inventory item from the system'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Unique identifier of the inventory item',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Inventory item deleted successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Inventory item deleted successfully' },
        data: { $ref: getSchemaPath(InventoryItemEntity) }
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Inventory item not found'
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Internal server error'
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const data = await this.inventoryService.remove(id);
    return { success: true, message: 'Inventory item deleted successfully', data };
  }
}

