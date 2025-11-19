import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, Min } from 'class-validator';

export class CreateInventoryItemDto {
  @ApiProperty({
    description: 'Name of the inventory item',
    example: 'Laptop',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Detailed description of the item',
    example: 'High-performance laptop for business use',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Available quantity',
    example: 15,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  quantity: number;

  @ApiProperty({
    description: 'Price per unit',
    example: 1299.99,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  price: number;
}

export class UpdateInventoryItemDto {
  @ApiProperty({
    description: 'Name of the inventory item',
    example: 'Updated Laptop',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Detailed description of the item',
    example: 'Updated description',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Available quantity',
    example: 20,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  quantity: number;

  @ApiProperty({
    description: 'Price per unit',
    example: 1499.99,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  price: number;
}

export class InventoryItemEntity {
  @ApiProperty({
    description: 'Auto-generated unique identifier',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Name of the inventory item',
    example: 'Laptop',
  })
  name: string;

  @ApiProperty({
    description: 'Detailed description of the item',
    example: 'High-performance laptop for business use',
  })
  description: string;

  @ApiProperty({
    description: 'Available quantity',
    example: 15,
  })
  quantity: number;

  @ApiProperty({
    description: 'Price per unit',
    example: 1299.99,
  })
  price: number;
}

