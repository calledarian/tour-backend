import { Module } from '@nestjs/common';
import { PackagesModule } from './packages/packages.module';
import { Packages } from './packages/packages.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { BookingsModule } from './bookings/bookings.module';
import { Bookings } from './bookings/bookings.entity';
import { AppController } from './app.controller';



@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: parseInt(config.get<string>('DB_PORT') ?? '5432', 10),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        entities: [Packages, Bookings],
        synchronize: true
      }),
    }),
    PackagesModule,
    AuthModule,
    BookingsModule,
  ],
  controllers: [AppController],
})
export class AppModule { }
