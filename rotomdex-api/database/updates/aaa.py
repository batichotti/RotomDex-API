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
    (DATA_DIR / 'items.json', 'items'),
    (DATA_DIR / 'pokemon.csv', 'pokemon'),
    (DATA_DIR / 'moves.csv', 'moves'),
    (DATA_DIR / 'abilities.csv', 'abilities'),
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
    
    with open(output_file, "w", encoding="utf-8") as f:
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
            f.write(f"INSERT INTO {table_name} VALUES ({values_str});\n")
    
    print(f"Generated {output_file}")

# Process all files
for file_path, table_name in files_to_process:
    process_file(file_path, table_name)
