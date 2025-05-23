import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bookings } from './bookings.entity';

@Injectable()
export class BookingsService {
    constructor(
        @InjectRepository(Bookings)
        private bookingsRepository: Repository<Bookings>,
    ) { }

    create(bookingData: Partial<Bookings>) {
        const booking = this.bookingsRepository.create(bookingData);
        return this.bookingsRepository.save(booking);
    }

    findAll() {
        return this.bookingsRepository.find();
    }

    findOne(id: number) {
        return this.bookingsRepository.findOneBy({ id });
    }

    delete(id: number) {
        return this.bookingsRepository.delete(id);
    }

    async updateStatus(id: number, status: 'confirmed' | 'cancelled' | 'pending') {
        const booking = await this.bookingsRepository.findOneBy({ id });
        if (!booking) {
            throw new Error('Booking not found');
        }
        booking.status = status;
        return this.bookingsRepository.save(booking);
    }
}
