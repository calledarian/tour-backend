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
    @Column()
    description: string;
    @Column('text', { array: true, nullable: true })
    images: string[];

}