import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, IsDateString } from 'class-validator';

export class FeedbackItemEntity {
  @ApiProperty({
    description: 'Auto-generated unique identifier',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Date of the feedback',
    example: '2025-11-14',
  })
  date: string;

  @ApiProperty({
    description: 'Title of the feedback',
    example: 'Great product quality',
  })
  title: string;

  @ApiProperty({
    description: 'Email of the reporter',
    example: 'customer@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Detailed description of the feedback',
    example: 'The product exceeded my expectations. Very satisfied with the purchase.',
  })
  description: string;
}

export class CreateFeedbackItemDto {
  @ApiProperty({
    description: 'Date of the feedback',
    example: '2025-11-14',
  })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({
    description: 'Title of the feedback',
    example: 'Great product quality',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Email of the reporter',
    example: 'customer@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Detailed description of the feedback',
    example: 'The product exceeded my expectations. Very satisfied with the purchase.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}

