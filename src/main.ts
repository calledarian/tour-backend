import * as crypto from 'crypto';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { ValidationPipe } from '@nestjs/common';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get the underlying Express instance and set trust proxy
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.set('trust proxy', 1);

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Travel API')
    .setDescription('API for managing travel packages and bookings')
    .setVersion('1.0')
    .addTag('packages')
    .addTag('bookings')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  // Define allowed origins for CORS
  const allowedOrigins = [process.env.FRONTEND_API];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) {
        // Allow requests with no origin like curl or Postman
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: false,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Log and respond to CORS errors gracefully
  expressApp.use((err, req, res, next) => {
    if (err) {
      console.error('CORS error:', err.message);
      return res.status(403).json({ message: 'CORS error: ' + err.message });
    }
    next();
  });

  // Rate limiters
  const bookingsPostLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 2,
    message: 'Too many booking requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });

  const bookingsVerifyLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: 'Too many booking verification requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });

  const loginPostLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 10,
    message: 'Too many login requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });

  const packagesGetLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 200,
    message: 'Too many requests, try again in 10 minutes.',
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Use rate limiters on routes, making sure OPTIONS requests pass through
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
    if (req.method === 'POST') {
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

  // Start server
  const port = process.env.PORT ?? 3002;
  await app.listen(port);
  console.log(`Server running on port ${port}`);
}

bootstrap();
