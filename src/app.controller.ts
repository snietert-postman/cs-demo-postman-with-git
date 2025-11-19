import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('General')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ 
    summary: 'API information',
    description: 'Get basic information about the API and available endpoints'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'API information retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        version: { type: 'string' },
        endpoints: { type: 'object' },
        documentation: { type: 'object' }
      }
    }
  })
  getInfo() {
    return {
      message: 'Welcome to the Inventory Management API',
      version: '1.0.0',
      endpoints: {
        'GET /api/inventory': 'List all inventory items',
        'GET /api/inventory/search?q=term': 'Search inventory items by name or description',
        'GET /api/inventory/:id': 'Get a specific inventory item',
        'POST /api/inventory': 'Create a new inventory item',
        'PUT /api/inventory/:id': 'Update an existing inventory item',
        'DELETE /api/inventory/:id': 'Delete an inventory item',
        'GET /api/feedback': 'List all customer feedback',
        'GET /api/feedback/:id': 'Get a specific feedback item',
        'POST /api/feedback': 'Submit new customer feedback'
      },
      documentation: {
        'GET /api-spec': 'OpenAPI 3.0 specification (JSON)'
      }
    };
  }
}

