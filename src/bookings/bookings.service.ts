import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bookings } from './bookings.entity';
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class BookingsService {
    constructor(
        @InjectRepository(Bookings)
        private bookingsRepository: Repository<Bookings>,
    ) { }

    async create(bookingData: Partial<Bookings>) {
        const booking = this.bookingsRepository.create({
            ...bookingData,
            referenceCode: uuidv4(),
        });

        return await this.bookingsRepository.save(booking);
    }

    async findByEmailAndReferenceCode(email: string, referenceCode: string): Promise<Bookings | null> {
        return this.bookingsRepository.findOne({
            where: {
                email,
                referenceCode,
            },
        });
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
