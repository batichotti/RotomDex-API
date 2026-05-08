import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('pokemon_moves')
export class PokemonMoves {
	@PrimaryColumn()
	pokemon_id!: number;

	@Column()
	pokemon_name!: string;

	@Column()
	move_name!: string;

	@PrimaryColumn()
	move_id!: number;

	@Column({ type: 'real', nullable: true })
	level_learned_at!: number;

	@PrimaryColumn()
	move_learn_method!: string;

	@PrimaryColumn()
	most_recent_game_learned_in!: string;
}
