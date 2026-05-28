import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('natures')
export class Nature {
    @PrimaryGeneratedColumn()
    name!: string;

    @Column('text')
    decreased_stat!: string;

    @Column('text')
    hates_flavor!: string;

    @Column('text')
    increased_stat!: string;

    @Column('text')
    likes_flavor!: string;
}