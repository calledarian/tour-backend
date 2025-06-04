import * as crypto from 'crypto';
import * as cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { ValidationPipe } from '@nestjs/common';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Enable CORS first — so preflight OPTIONS requests are handled correctly
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  });

  // 2. Use cookie parser next (before any routes/middleware)
  app.use(cookieParser());

  // 3. Global validation pipe to sanitize and transform request bodies
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip unexpected fields
      forbidNonWhitelisted: false,
      transform: true, // Automatically transform payloads to DTO instances
    }),
  );

  // 4. Setup Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Travel API')
    .setDescription('API for managing travel packages and bookings')
    .setVersion('1.0')
    .addTag('packages')
    .addTag('bookings')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // 5. Rate limiting middleware for different routes
  const bookingsPostLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 2,
    message: 'Too many booking requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });

  const bookingsVerifyLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20,
    message: 'Too many booking verification requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });

  const loginPostLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 10,
    message: 'Too many login requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });

  const packagesGetLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 200,
    message: 'Too many requests, try again in 10 minutes.',
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Apply rate limiters by route and method
  app.use('/bookings/verify', (req, res, next) => {
    if (req.method === 'POST') {
      return bookingsVerifyLimiter(req, res, next);
    }
    next();
  });

  app.use('/bookings', (req, res, next) => {
    const isVerifyPath = req.originalUrl.startsWith('/bookings/verify');
    if (req.method === 'POST' && !isVerifyPath) {
      return bookingsPostLimiter(req, res, next);
    }
    next();
  });

  app.use('/auth/login', (req, res, next) => {
    if (req.method === 'POST' && req.path === '/') {
      return loginPostLimiter(req, res, next);
    }
    next();
  });

  app.use('/packages', (req, res, next) => {
    if (req.method === 'GET') {
      return packagesGetLimiter(req, res, next);
    }
    next();
  });

  const port = process.env.PORT ?? 3002;
  await app.listen(port);
  console.log(`Server running on port ${port}`);
}

bootstrap();
