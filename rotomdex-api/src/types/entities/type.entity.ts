import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('type')
export class Type {
    @Column()
    attack_type!: string;

    @Column()
    defense_type!: string;

    @Column()
    effectiveness!: number;
}
