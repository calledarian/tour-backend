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

    async create(packageData: Partial<Packages>): Promise<Packages> {
        const newPackage = this.packageRepository.create(packageData);
        return await this.packageRepository.save(newPackage);
    }

    async update(id: number, packageData: Partial<Packages>): Promise<Packages> {
        await this.packageRepository.update(id, packageData);
        const updated = await this.packageRepository.findOneBy({ id });
        if (!updated) {
            throw new Error('Package not found');
        }
        return updated;
    }


    async remove(id: number): Promise<void> {
        const deleteResult = await this.packageRepository.delete(id);
        if (deleteResult.affected === 0) {
            throw new NotFoundException(`Package with id ${id} not found`);
        }
    }
}
