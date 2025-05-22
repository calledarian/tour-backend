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
    @Column('simple-array', { nullable: true })
    images: string[];
    @Column('json', { nullable: true })
    highlights: string[];


}