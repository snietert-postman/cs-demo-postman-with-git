import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle('Inventory Management API')
    .setDescription('A RESTful API for inventory management with CRUD operations. This API provides endpoints to create, read, update, and delete inventory items, as well as search functionality.')
    .setVersion('1.0.0')
    .addServer(`http://localhost:${process.env.PORT || 3000}`, 'Local development server')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  // Save OpenAPI spec to file
  const OPENAPI_SPEC_FILE = path.join(process.cwd(), 'openapi.json');
  fs.writeFileSync(OPENAPI_SPEC_FILE, JSON.stringify(document, null, 2));
  console.log(`✓ OpenAPI spec saved to ${OPENAPI_SPEC_FILE}`);

  // Serve OpenAPI spec at /api-spec
  app.use('/api-spec', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(document);
  });

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);

  console.log(`\n${'='.repeat(60)}`);
  console.log(`Inventory Management API is running on port ${PORT}`);
  console.log(`Access the API at http://localhost:${PORT}`);
  console.log(`View all inventory items at http://localhost:${PORT}/api/inventory`);
  console.log(`Data file: ${path.join(process.cwd(), 'data.json')}`);
  console.log(`\nOpenAPI Documentation:`);
  console.log(`  OpenAPI 3.0 Spec: http://localhost:${PORT}/api-spec`);
  console.log(`  Spec file: ${OPENAPI_SPEC_FILE}`);
  console.log(`${'='.repeat(60)}\n`);
}

bootstrap();

