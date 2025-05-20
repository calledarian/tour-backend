import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('packages')
export class Packages {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    location: string;
    @Column()
    title: string;
    @Column()
    price: number;
    @Column()
    duration: string;
}