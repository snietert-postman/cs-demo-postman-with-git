import { Controller, Get, Post, Body, Param, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackItemDto, FeedbackItemEntity } from './dto/feedback-item.dto';

@ApiTags('Feedback')
@ApiExtraModels(FeedbackItemEntity)
@Controller('api/feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Get()
  @ApiOperation({ 
    summary: 'List all customer feedback',
    description: 'Retrieve a complete list of all customer feedback items with date, title, email, and description'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Successfully retrieved feedback items',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        count: { type: 'integer', example: 3 },
        data: {
          type: 'array',
          items: { $ref: getSchemaPath(FeedbackItemEntity) }
        }
      }
    }
  })
  findAll() {
    const data = this.feedbackService.findAll();
    return { success: true, count: data.length, data };
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get a specific feedback item',
    description: 'Retrieve details of a single feedback item by its ID'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Unique identifier of the feedback item',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Successfully retrieved feedback item',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: { $ref: getSchemaPath(FeedbackItemEntity) }
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Feedback item not found',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        error: { type: 'string', example: 'Feedback item with ID 1 not found' }
      }
    }
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    const data = this.feedbackService.findOne(id);
    return { success: true, data };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Submit new customer feedback',
    description: 'Create a new feedback item'
  })
  @ApiBody({ type: CreateFeedbackItemDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Feedback submitted successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Feedback submitted successfully' },
        data: { $ref: getSchemaPath(FeedbackItemEntity) }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid input data'
  })
  async create(@Body() createDto: CreateFeedbackItemDto) {
    const data = await this.feedbackService.create(createDto);
    return { success: true, message: 'Feedback submitted successfully', data };
  }
}

