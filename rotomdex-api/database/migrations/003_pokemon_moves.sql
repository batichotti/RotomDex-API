CREATE TABLE pokemon_moves (
	pokemon_id INTEGER NOT NULL,
	pokemon_name TEXT NOT NULL,
	move_name TEXT NOT NULL,
	move_id INTEGER NOT NULL,
	level_learned_at REAL,
	move_learn_method TEXT NOT NULL,
	most_recent_game_learned_in TEXT NOT NULL
);
