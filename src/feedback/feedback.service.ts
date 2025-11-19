import { Injectable, NotFoundException } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import { FeedbackItemEntity, CreateFeedbackItemDto } from './dto/feedback-item.dto';

@Injectable()
export class FeedbackService {
  private feedback: FeedbackItemEntity[] = [];
  private nextId = 1;
  private readonly DATA_FILE = path.join(process.cwd(), 'data.json');

  private readonly sampleFeedback: FeedbackItemEntity[] = [
    { 
      id: 1, 
      date: '2025-11-10', 
      title: 'Excellent Service', 
      email: 'john.doe@example.com',
      description: 'The customer support team was very helpful and responsive. Highly recommend!' 
    },
    { 
      id: 2, 
      date: '2025-11-12', 
      title: 'Product Quality Issue', 
      email: 'jane.smith@example.com',
      description: 'The laptop I received had a defective keyboard. Hoping for a quick replacement.' 
    },
    { 
      id: 3, 
      date: '2025-11-14', 
      title: 'Fast Delivery', 
      email: 'mike.johnson@example.com',
      description: 'Ordered on Monday, received on Wednesday. Packaging was excellent!' 
    }
  ];

  async onModuleInit() {
    await this.readDataFromFile();
  }

  private async readDataFromFile(): Promise<void> {
    try {
      const data = await fs.readFile(this.DATA_FILE, 'utf8');
      const parsedData = JSON.parse(data);
      this.feedback = parsedData.feedback || [];
      
      // Initialize nextId based on existing feedback
      if (this.feedback.length > 0) {
        this.nextId = Math.max(...this.feedback.map(f => f.id)) + 1;
      }
      
      // If no feedback exists, initialize with sample data
      if (this.feedback.length === 0) {
        this.feedback = [...this.sampleFeedback];
        this.nextId = 4;
        await this.writeDataToFile();
      }
      
      console.log(`✓ Loaded ${this.feedback.length} feedback items from data.json`);
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log('⚠ data.json not found for feedback, initializing with sample data');
        this.feedback = [...this.sampleFeedback];
        this.nextId = 4;
        await this.writeDataToFile();
      } else {
        console.error('✗ Error reading data.json for feedback:', error.message);
        throw error;
      }
    }
  }

  private async writeDataToFile(): Promise<void> {
    try {
      // Read existing data first to preserve other data sections
      let existingData = {};
      try {
        const data = await fs.readFile(this.DATA_FILE, 'utf8');
        existingData = JSON.parse(data);
      } catch (error) {
        // File doesn't exist, start with empty object
      }

      // Update only the feedback section
      const updatedData = {
        ...existingData,
        feedback: this.feedback
      };

      await fs.writeFile(this.DATA_FILE, JSON.stringify(updatedData, null, 2), 'utf8');
      console.log(`✓ Saved ${this.feedback.length} feedback items to data.json`);
    } catch (error) {
      console.error('✗ Error writing feedback to data.json:', error.message);
      throw error;
    }
  }

  findAll(): FeedbackItemEntity[] {
    return this.feedback;
  }

  findOne(id: number): FeedbackItemEntity {
    const item = this.feedback.find(item => item.id === id);
    if (!item) {
      throw new NotFoundException(`Feedback item with ID ${id} not found`);
    }
    return item;
  }

  async create(createDto: CreateFeedbackItemDto): Promise<FeedbackItemEntity> {
    const newItem: FeedbackItemEntity = {
      id: this.nextId++,
      date: createDto.date,
      title: createDto.title.trim(),
      email: createDto.email.trim(),
      description: createDto.description.trim(),
    };

    this.feedback.push(newItem);
    await this.writeDataToFile();
    return newItem;
  }
}

