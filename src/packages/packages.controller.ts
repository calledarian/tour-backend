import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
} from '@nestjs/common';
import { PackagesService } from './packages.service';
import { Packages } from './packages.entity';
import {
    ApiTags,
    ApiOperation,
} from '@nestjs/swagger';

@ApiTags('Packages')
@Controller('packages')
export class PackagesController {
    constructor(private readonly packagesService: PackagesService) { }

    @Get()
    @ApiOperation({ summary: 'Get all packages' })
    getAll(): Promise<Packages[]> {
        return this.packagesService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get package by ID' })
    getOne(@Param('id') id: number): Promise<Packages> {
        return this.packagesService.findOne(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create a new package' })
    create(@Body() packageEntity: Packages): Promise<Packages> {
        return this.packagesService.create(packageEntity);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update package by ID' })
    update(@Param('id') id: number, @Body() packageEntity: Packages): Promise<Packages> {
        return this.packagesService.update(id, packageEntity);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete package by ID' })
    async remove(@Param('id') id: number): Promise<{ message: string }> {
        await this.packagesService.remove(id);
        return { message: `Package ${id} deleted successfully` };
    }
}
