import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('packages')
export class Packages {
    @PrimaryColumn()
    id: string;
    @Column()
    location: string;
    @Column()
    title: string;
    @Column()
    url: string;
    @Column()
    price: number;
    @Column()
    duration: string;
}