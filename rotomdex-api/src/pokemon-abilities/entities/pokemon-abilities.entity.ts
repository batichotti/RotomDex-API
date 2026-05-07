import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('pokemon_abilities')
export class PokemonAbilities {
    @PrimaryColumn()
    pokemon_id!: number;

    @Column()
    pokemon_name!: string;

    @Column()
    ability_name!: string;

    @PrimaryColumn()
    ability_id!: number;

    @Column()
    ability_slot!: number;

    @Column()
    is_hidden!: boolean;
}
