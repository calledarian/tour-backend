// bookings.entity.ts
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

@Entity('bookings')
export class Bookings {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    tourId: number;
    @Column({ length: 100 })
    name: string;
    @Column({ length: 100 })
    email: string;
    @Column()
    people: number;
    @Column({ length: 20 })
    phone: string;
    @Column({ type: 'date' })
    tourDate: Date;
    @Column({ type: 'text', nullable: true })
    notes: string;
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    totalPrice: number;
    @Column({ default: 'pending' })
    status: string; // pending, confirmed, cancelled
    @CreateDateColumn()
    createdAt: Date;
}