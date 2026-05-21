import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('items')
export class Item {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    cost!: number;

    @Column()
    fling_power!: number;

    @Column()
    category!: string;

    @Column()
    description!: string;
}
