import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('types')
export class Type {
    @PrimaryColumn()
    attack_type!: string;

    @PrimaryColumn()
    defense_type!: string;

    @Column('numeric', { precision: 4, scale: 2 })
    effectiveness!: number;
}
