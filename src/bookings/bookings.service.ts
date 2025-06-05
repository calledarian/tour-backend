import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bookings } from './bookings.entity';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';


@Injectable()
export class BookingsService {
    constructor(
        @InjectRepository(Bookings)
        private bookingsRepository: Repository<Bookings>,
    ) { }

    async verifyCaptcha(token: string): Promise<boolean> {
        const secretKey = process.env.RECAPTCHA_SECRET_KEY;
        if (!secretKey) {
            throw new Error('reCAPTCHA secret key not set in environment variables');
        }

        const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

        try {
            const response = await axios.post(url);
            return response.data.success && response.data.score >= 0.5;
            // For reCAPTCHA v2, score might not exist, so just use response.data.success
            // For v2 use:
            // return response.data.success;
        } catch (error) {
            console.error('Captcha verification error:', error);
            return false;
        }
    }

    async create(bookingData: Partial<Bookings>) {
        const booking = this.bookingsRepository.create({
            ...bookingData,
            referenceCode: uuidv4().slice(0, 8),
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
