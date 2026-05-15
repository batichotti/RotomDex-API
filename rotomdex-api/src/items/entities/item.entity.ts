import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('items')
export class Items {
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
    attributes!: string;

    @Column()
    held_by_pokemon!: string;

    @Column()
    baby_trigger_for!: string;

    @Column()
    machine!: string;

    @Column()
    description!: string;
}
