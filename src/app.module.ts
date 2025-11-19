import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { InventoryModule } from './inventory/inventory.module';
import { FeedbackModule } from './feedback/feedback.module';

@Module({
  imports: [InventoryModule, FeedbackModule],
  controllers: [AppController],
})
export class AppModule {}

