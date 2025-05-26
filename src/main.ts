import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
dotenv.config();


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

  const bookingsPostLimiter = rateLimit({
    windowMs: 60 * 15000, // 15 minute
    max: 2,
    message: 'Too many booking requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });
  const packagesGetLimiter = rateLimit({
    windowMs: 60 * 10000, // 10 minute
    max: 50,
    message: 'Too many requests, try in 10 minutes.',
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use('/bookings', (req, res, next) => {
    if (req.method === 'POST') {
      return bookingsPostLimiter(req, res, next);
    }
    next();
  });
  app.use('/packages', (req, res, next) => {
    if (req.method === 'GET') {
      return packagesGetLimiter(req, res, next);
    }
    next();
  });





  app.enableCors();

  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
