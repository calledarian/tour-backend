import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    UseGuards,
    UseInterceptors,
    UploadedFiles,
} from '@nestjs/common';
import { PackagesService } from './packages.service';
import { Packages } from './packages.entity';
import {
    ApiTags,
    ApiOperation,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { storage } from 'src/db/claudinary.config';
import { FilesInterceptor } from '@nestjs/platform-express';



@ApiTags('packages')
@Controller('/packages')
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

    @UseGuards(JwtAuthGuard)
    @Post('create')
    @ApiOperation({ summary: 'Create a new package' })
    create(@Body() packageData: Packages): Promise<Packages> {
        return this.packagesService.create(packageData);
    }


    @UseGuards(JwtAuthGuard)
    @Post('upload-images')
    @UseInterceptors(FilesInterceptor('images', 4, { storage }))
    uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
        const imageUrls = files.map(file => file.path);
        return { imageUrls };
    }


    @UseGuards(JwtAuthGuard)
    @Put(':id')
    @ApiOperation({ summary: 'Update package by ID' })
    update(@Param('id') id: number, @Body() packageEntity: Packages): Promise<Packages> {
        return this.packagesService.update(id, packageEntity);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    @ApiOperation({ summary: 'Delete package by ID' })
    async remove(@Param('id') id: number): Promise<{ message: string }> {
        await this.packagesService.remove(id);
        return { message: `Package ${id} deleted successfully` };
    }
}
