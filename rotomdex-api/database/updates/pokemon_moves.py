import os
import time

import requests

BASE_URL = "https://pokeapi.co/api/v2"

def get_all_pokemon():
    url = f"{BASE_URL}/pokemon?limit=10000"
    response = requests.get(url)
    response.raise_for_status()
    return response.json()["results"]

def get_pokemon_data(pokemon_url):
    response = requests.get(pokemon_url)
    response.raise_for_status()
    data = response.json()
    
    pokemon_id = data["id"]
    pokemon_name = data["name"]
    moves = []
    for move_entry in data["moves"]:
        move_name = move_entry["move"]["name"]
        move_url = move_entry["move"].get("url", "")
        move_id = None
        if move_url:
            try:
                parts = move_url.rstrip("/").split("/")
                move_id = int(parts[-1])
            except Exception:
                move_id = None

        version_details = move_entry.get("version_group_details", [])
        most_recent_detail = None
        most_recent_version_group_id = -1

        for detail in version_details:
            version_group = detail.get("version_group", {})
            version_group_url = version_group.get("url", "")
            version_group_id = -1
            if version_group_url:
                try:
                    parts = version_group_url.rstrip("/").split("/")
                    version_group_id = int(parts[-1])
                except Exception:
                    version_group_id = -1

            if version_group_id >= most_recent_version_group_id:
                most_recent_version_group_id = version_group_id
                most_recent_detail = detail

        level_learned_at = None
        move_learn_method = ""
        most_recent_game_learned_in = ""

        if most_recent_detail:
            level_learned_at = most_recent_detail.get("level_learned_at")
            move_learn_method = most_recent_detail.get("move_learn_method", {}).get("name", "")
            most_recent_game_learned_in = most_recent_detail.get("version_group", {}).get("name", "")

        moves.append(
            (
                move_name,
                move_id,
                level_learned_at,
                move_learn_method,
                most_recent_game_learned_in,
            )
        )

    return pokemon_id, pokemon_name, moves

def build_rows():
    rows = []
    pokemon_list = get_all_pokemon()

    for i, pokemon in enumerate(pokemon_list):
        url = pokemon["url"]

        try:
            pokemon_id, name, moves = get_pokemon_data(url)

            for move_name, move_id, level_learned_at, move_learn_method, most_recent_game_learned_in in moves:
                rows.append([
                    pokemon_id,
                    name,
                    move_name,
                    move_id,
                    level_learned_at,
                    move_learn_method,
                    most_recent_game_learned_in,
                ])

            print(f"[{i+1}/{len(pokemon_list)}] Processado: {name}")
            time.sleep(0.1)

        except Exception as e:
            print(f"Erro: {e}")

    return rows


def format_sql_value(value):
    if value is None:
        return "NULL"
    if isinstance(value, bool):
        return "TRUE" if value else "FALSE"
    if isinstance(value, str):
        escaped = value.replace("'", "''")
        return f"'{escaped}'"
    return str(value)


def save_sql(rows, filename="008_pokemon_moves.sql"):
    script_dir = os.path.dirname(os.path.abspath(__file__))
    migrations_dir = os.path.abspath(os.path.join(script_dir, "..", "migrations"))
    filepath = os.path.join(migrations_dir, filename)

    os.makedirs(migrations_dir, exist_ok=True)

    create_table_sql = """DROP TABLE IF EXISTS pokemon_moves;

CREATE TABLE pokemon_moves (
    pokemon_id INTEGER NOT NULL,
    pokemon_name VARCHAR NOT NULL,
    move_name VARCHAR NOT NULL,
    move_id INTEGER NOT NULL,
    level_learned_at INTEGER,
    move_learn_method VARCHAR NOT NULL,
    most_recent_game_learned_in VARCHAR NOT NULL,
    PRIMARY KEY (pokemon_id, move_id),
    FOREIGN KEY (pokemon_id) REFERENCES pokemon(id),
    FOREIGN KEY (move_id) REFERENCES moves(id)
);
"""

    insert_statements = []
    for row in rows:
        values = ", ".join(format_sql_value(value) for value in row)
        insert_statements.append(f"INSERT INTO pokemon_moves VALUES ({values});")

    with open(filepath, "w", encoding="utf-8", newline="") as f:
        f.write(create_table_sql)
        f.write("\n")
        f.write("\n".join(insert_statements))
        f.write("\n")

    print(f"\nSQL salvo em: {filepath}")

if __name__ == "__main__":
    rows = build_rows()
    save_sql(rows)