import { Module } from '@nestjs/common';
import { PackagesModule } from './packages/packages.module';
import { Packages } from './packages/packages.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { BookingsModule } from './bookings/bookings.module';
import { Bookings } from './bookings/bookings.entity';


@Module({
  imports: [

    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: +(config.get<number>('DB_PORT') ?? 5432),
        username: config.get('DB_USER'),
        password: config.get('DB_PASS'),
        database: config.get('DB_NAME'),
        entities: [Packages, Bookings],
        synchronize: true
      }),
    }),
    PackagesModule,
    AuthModule,
    BookingsModule,
  ],
})
export class AppModule { }
