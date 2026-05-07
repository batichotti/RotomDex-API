DROP TABLE IF EXISTS pokemon_moves;

CREATE TABLE pokemon_moves (
  pokemon_id              INTEGER NOT NULL,
  pokemon_name            VARCHAR NOT NULL,
  move_name               VARCHAR NOT NULL,
  move_id                 INTEGER NOT NULL,
  level_learned_at        INTEGER,
  move_learn_method       VARCHAR NOT NULL,
  most_recent_game_learned_in VARCHAR NOT NULL,
  PRIMARY KEY (pokemon_id, move_id),
  FOREIGN KEY (pokemon_id) REFERENCES pokemon(id),
  FOREIGN KEY (move_id) REFERENCES moves(id)
);