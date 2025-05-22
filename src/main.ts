import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Package API')
    .setDescription('CRUD API for managing travel packages')
    .setVersion('1.0')
    .addTag('packages')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);


  app.enableCors();

  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
