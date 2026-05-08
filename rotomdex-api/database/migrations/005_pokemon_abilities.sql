DROP TABLE IF EXISTS pokemon_abilities;

CREATE TABLE pokemon_abilities (
    pokemon_id INTEGER NOT NULL,
    pokemon_name TEXT NOT NULL,
    ability_name TEXT NOT NULL,
    ability_id INTEGER NOT NULL,
    ability_slot INTEGER NOT NULL,
    is_hidden BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (pokemon_id, ability_id),
    FOREIGN KEY (pokemon_id) REFERENCES pokemon(id),
    FOREIGN KEY (ability_id) REFERENCES abilities(id)
);