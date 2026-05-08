import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('abilities')
export class Abilities {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    generation_introduced!: string;

    @Column()
    description!: string;

    @Column()
    short_description!: string;
}