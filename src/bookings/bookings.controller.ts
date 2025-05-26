import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    UseGuards,
    Patch,
    BadRequestException,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { Bookings } from './bookings.entity';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('bookings')
@Controller('/bookings')
export class BookingsController {
    constructor(private readonly bookingsService: BookingsService) { }

    @Post()
    @ApiOperation({ summary: 'Booking request, 2 per 15 minutes' })
    create(@Body() createBookingDto: Partial<Bookings>) {
        if (!createBookingDto || Object.keys(createBookingDto).length === 0) {
            throw new BadRequestException('Request body cannot be empty.');
        }
        return this.bookingsService.create(createBookingDto);
    }


    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'For admin to manage bookings' })
    @Get()
    findAll() {
        return this.bookingsService.findAll();
    }
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'For admin to see all bookings' })
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.bookingsService.findOne(+id);
    }
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'For admin to delete spam bookings' })
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.bookingsService.delete(+id);
    }
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'For admin to manage bookings' })
    @Patch(':id')
    updateStatus(
        @Param('id') id: string,
        @Body('status') status: 'confirmed' | 'cancelled' | 'pending',
    ) {
        return this.bookingsService.updateStatus(+id, status);
    }
}
