import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('pokemon_evolutions')
export class Evolution {
    @PrimaryGeneratedColumn()
    pokemon_id!: number;

    @Column({ nullable: false })
    pokemon_name!: string;

    @Column({ nullable: false })
    species_id!: number;

    @Column({ nullable: true })
    evolves_from_name!: string;

    @Column({ nullable: true })
    evolves_from_id!: number;

    @Column({ nullable: true })
    evolves_from_species_id!: number;

    @Column({ nullable: true })
    evolution_method!: string;

    @Column({ type: 'smallint', nullable: false })
    evolution_stage!: number;

    @Column({ nullable: false })
    is_fully_evolved!: boolean;
}
