import { Module } from '@nestjs/common';
import { PackagesService } from './packages.service';
import { PackagesController } from './packages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Packages } from './packages.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Packages])],
  providers: [PackagesService],
  controllers: [PackagesController]
})
export class PackagesModule { }
