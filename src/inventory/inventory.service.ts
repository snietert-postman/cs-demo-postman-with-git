import { Injectable, NotFoundException } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import { CreateInventoryItemDto, UpdateInventoryItemDto, InventoryItemEntity } from './dto/inventory-item.dto';

@Injectable()
export class InventoryService {
  private inventory: InventoryItemEntity[] = [];
  private nextId = 1;
  private readonly DATA_FILE = path.join(process.cwd(), 'data.json');

  private readonly sampleInventory: InventoryItemEntity[] = [
    { id: 1, name: 'Laptop', description: 'High-performance laptop for business use', quantity: 15, price: 1299.99 },
    { id: 2, name: 'Wireless Mouse', description: 'Ergonomic wireless mouse with USB receiver', quantity: 50, price: 29.99 },
    { id: 3, name: 'USB-C Cable', description: '6ft USB-C charging cable', quantity: 100, price: 12.99 }
  ];

  async onModuleInit() {
    await this.readDataFromFile();
  }

  private async readDataFromFile(): Promise<void> {
    try {
      const data = await fs.readFile(this.DATA_FILE, 'utf8');
      const parsedData = JSON.parse(data);
      this.inventory = parsedData.inventory || [];
      this.nextId = parsedData.nextId || 1;
      console.log(`✓ Loaded ${this.inventory.length} items from data.json`);
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log('⚠ data.json not found, initializing with sample data');
        this.inventory = [...this.sampleInventory];
        this.nextId = 4;
        await this.writeDataToFile();
      } else {
        console.error('✗ Error reading data.json:', error.message);
        throw error;
      }
    }
  }

  private async writeDataToFile(): Promise<void> {
    try {
      const data = JSON.stringify({ inventory: this.inventory, nextId: this.nextId }, null, 2);
      await fs.writeFile(this.DATA_FILE, data, 'utf8');
      console.log(`✓ Saved ${this.inventory.length} items to data.json`);
    } catch (error) {
      console.error('✗ Error writing to data.json:', error.message);
      throw error;
    }
  }

  findAll(): InventoryItemEntity[] {
    return this.inventory;
  }

  findOne(id: number): InventoryItemEntity {
    const item = this.inventory.find(item => item.id === id);
    if (!item) {
      throw new NotFoundException(`Inventory item with ID ${id} not found`);
    }
    return item;
  }

  search(query: string): InventoryItemEntity[] {
    const lowerQuery = query.toLowerCase();
    return this.inventory.filter(item => {
      const nameMatch = item.name.toLowerCase().includes(lowerQuery);
      const descriptionMatch = item.description.toLowerCase().includes(lowerQuery);
      return nameMatch || descriptionMatch;
    });
  }

  async create(createDto: CreateInventoryItemDto): Promise<InventoryItemEntity> {
    const newItem: InventoryItemEntity = {
      id: this.nextId++,
      name: createDto.name.trim(),
      description: createDto.description.trim(),
      quantity: createDto.quantity,
      price: createDto.price,
    };

    this.inventory.push(newItem);
    await this.writeDataToFile();
    return newItem;
  }

  async update(id: number, updateDto: UpdateInventoryItemDto): Promise<InventoryItemEntity> {
    const item = this.findOne(id);
    
    item.name = updateDto.name.trim();
    item.description = updateDto.description.trim();
    item.quantity = updateDto.quantity;
    item.price = updateDto.price;

    await this.writeDataToFile();
    return item;
  }

  async remove(id: number): Promise<InventoryItemEntity> {
    const itemIndex = this.inventory.findIndex(item => item.id === id);
    if (itemIndex === -1) {
      throw new NotFoundException(`Inventory item with ID ${id} not found`);
    }

    const deletedItem = this.inventory.splice(itemIndex, 1)[0];
    await this.writeDataToFile();
    return deletedItem;
  }
}

