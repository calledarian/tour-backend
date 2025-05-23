import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    UseGuards,
    Patch,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { Bookings } from './bookings.entity';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';

@Controller('bookings')
export class BookingsController {
    constructor(private readonly bookingsService: BookingsService) { }

    @Post()
    create(@Body() createBookingDto: Partial<Bookings>) {
        return this.bookingsService.create(createBookingDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll() {
        return this.bookingsService.findAll();
    }
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.bookingsService.findOne(+id);
    }
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.bookingsService.delete(+id);
    }
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    updateStatus(
        @Param('id') id: string,
        @Body('status') status: 'confirmed' | 'cancelled' | 'pending',
    ) {
        return this.bookingsService.updateStatus(+id, status);
    }
}
