import json
import numpy as np
import pandas as pd
import os
from pathlib import Path

# Get the base directory dynamically
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / 'pokemon_za'
MIGRATIONS_DIR = BASE_DIR / 'migrations'

# List of files to process
files_to_process = [
    (DATA_DIR / 'pokemon.csv', 'pokemon'),
    (DATA_DIR / 'moves.csv', 'moves'),
    (DATA_DIR / 'abilities.csv', 'abilities'),
    (DATA_DIR / 'items.json', 'items'),
    (DATA_DIR / 'pokemon_abilities.csv', 'pokemon_abilities'),
    (DATA_DIR / 'pokemon_moves.csv', 'pokemon_moves'),
]

def process_file(file_path, table_name):
    """Process a file and generate SQL migration"""
    if not os.path.exists(file_path):
        print(f"Warning: {file_path} not found, skipping...")
        return
    
    if str(file_path).endswith('.json'):
        df = pd.read_json(file_path)
    else:
        df = pd.read_csv(file_path)
    
    output_file = MIGRATIONS_DIR / f"{table_name}.sql"
    # Use unnumbered table name for SQL statements (e.g., 'pokemon' not '001_pokemon')
    base_table_name = table_name
    if '_' in table_name and table_name[:3].isdigit():
        base_table_name = table_name.split('_', 1)[1]
    
    # Schema definitions for specific tables
    schemas = {
        '001_pokemon': """DROP TABLE IF EXISTS pokemon;

CREATE TABLE pokemon (
    id INTEGER PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    species_id INTEGER NOT NULL,
    species_name VARCHAR(100) NOT NULL,
    generation VARCHAR(20) NOT NULL,
    is_legendary BOOLEAN NOT NULL,
    is_mythical BOOLEAN NOT NULL,
    is_baby BOOLEAN NOT NULL,
    has_gender_differences BOOLEAN NOT NULL,
    forms_switchable BOOLEAN NOT NULL,
    is_mega BOOLEAN NOT NULL,
    is_gmax BOOLEAN NOT NULL,
    is_regional_form BOOLEAN NOT NULL,
    egg_group_1 VARCHAR(20),
    egg_group_2 VARCHAR(20),
    primary_type VARCHAR(20) NOT NULL,
    secondary_type VARCHAR(20),
    hp SMALLINT NOT NULL,
    attack SMALLINT NOT NULL,
    defense SMALLINT NOT NULL,
    special_attack SMALLINT NOT NULL,
    special_defense SMALLINT NOT NULL,
    speed SMALLINT NOT NULL,
    bst SMALLINT NOT NULL,
    height INTEGER NOT NULL,
    weight FLOAT NOT NULL,
    base_experience NUMERIC(6,1) NOT NULL
);"""
                ,
                '002_moves': """DROP TABLE IF EXISTS moves;

CREATE TABLE moves (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    accuracy REAL,
    power REAL,
    type TEXT NOT NULL,
    pp INTEGER NOT NULL,
    effect_chance REAL,
    priority INTEGER NOT NULL DEFAULT 0,
    damage_class TEXT NOT NULL,
    generation_introduced TEXT NOT NULL,
    description TEXT,
    short_description TEXT,
    category TEXT
);"""
                                ,
                                '003_abilities': """DROP TABLE IF EXISTS abilities;

CREATE TABLE abilities (
	id SERIAL PRIMARY KEY,
	name TEXT NOT NULL,
	generation_introduced TEXT NOT NULL,
	description TEXT NOT NULL,
	short_description TEXT NOT NULL
);""",
                                '004_items': """DROP TABLE IF EXISTS items;

CREATE TABLE items (
    id INTEGER PRIMARY KEY,
    description TEXT NOT NULL
);""",
                                '005_pokemon_abilities': """DROP TABLE IF EXISTS pokemon_abilities;

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
);""",
                                '006_pokemon_moves': """DROP TABLE IF EXISTS pokemon_moves;

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
);"""
    }
    
    with open(output_file, "w", encoding="utf-8") as f:
        # Use custom schema if available, otherwise generate generic one
        if table_name in schemas:
            f.write(schemas[table_name] + "\n\n")
        else:
            # Criar tabela (todas colunas como TEXT, simples e compatível)
            columns = ", ".join([f'"{col}" TEXT' for col in df.columns])
            f.write(f"CREATE TABLE {table_name} ({columns});\n\n")

        # Inserir dados
        for _, row in df.iterrows():
            values = []
            for v in row.values:
                # pd.isna can return an array for list-like objects; handle safely
                na = pd.isna(v)
                if hasattr(na, 'all'):
                    na = na.all()

                if na:
                    values.append("NULL")
                else:
                    # For list/dict/ndarray, dump as JSON string; escape single quotes
                    if isinstance(v, (list, dict, tuple, np.ndarray, pd.Series)):
                        val = json.dumps(v, ensure_ascii=False)
                    else:
                        val = str(v)
                    val = val.replace("'", "''")
                    values.append(f"'{val}'")

            values_str = ", ".join(values)
            f.write(f"INSERT INTO {base_table_name} VALUES ({values_str});\n")
    
    print(f"Generated {output_file}")

# Process all files
for idx, (file_path, table_name) in enumerate(files_to_process, 1):
    numbered_table_name = f"{idx:03d}_{table_name}"
    process_file(file_path, numbered_table_name)
