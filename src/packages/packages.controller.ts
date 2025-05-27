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
    @UseInterceptors(FilesInterceptor('images', 4, { storage }))
    @ApiOperation({ summary: 'Create a new package (with images)' })
    async create(
        @Body() body: any,
        @UploadedFiles() files: Express.Multer.File[],
    ): Promise<Packages> {
        // Parse highlights JSON string into array
        let highlights: string[] = [];
        if (body.highlights) {
            try {
                highlights = JSON.parse(body.highlights);
            } catch (e) {
                highlights = [];
            }
        }

        // Convert price string to number
        const price = Number(body.price);

        // Collect image paths from uploaded files
        const images = files.map(file => file.path);

        // Build the package object to save
        const packageData: Partial<Packages> = {
            location: body.location,
            title: body.title,
            price,
            duration: body.duration,
            description: body.description,
            costIncludes: body.costIncludes,
            highlights,
            images,
        };

        return this.packagesService.create(packageData);
    }

    @UseGuards(JwtAuthGuard)
    @Post('upload-images')
    @UseInterceptors(FilesInterceptor('images', 4, { storage }))
    @ApiOperation({ summary: 'Essential for uploading images' })
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
