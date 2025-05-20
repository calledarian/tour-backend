import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Packages } from './packages.entity';

@Injectable()
export class PackagesService {
    constructor(
        @InjectRepository(Packages)
        private packageRepository: Repository<Packages>,
    ) { }

    findAll(): Promise<Packages[]> {
        return this.packageRepository.find();
    }

    async findOne(id: number): Promise<Packages> {
        const packageEntity = await this.packageRepository.findOneBy({ id: id });
        if (!packageEntity) {
            throw new NotFoundException(`Package with id ${id} not found`);
        }
        return packageEntity;
    }

    create(packageEntity: Packages): Promise<Packages> {
        return this.packageRepository.save(packageEntity);
    }

    async update(id: number, packageEntity: Packages): Promise<Packages> {
        const existingPackage = await this.findOne(id);
        Object.assign(existingPackage, packageEntity);
        return this.packageRepository.save(existingPackage);
    }

    async remove(id: number): Promise<void> {
        const deleteResult = await this.packageRepository.delete(id);
        if (deleteResult.affected === 0) {
            throw new NotFoundException(`Package with id ${id} not found`);
        }
    }
}
