import os
import time

import requests

BASE_URL = "https://pokeapi.co/api/v2"


def get_all_abilities():
    url = f"{BASE_URL}/ability?limit=10000"
    response = requests.get(url)
    response.raise_for_status()
    return response.json()["results"]


def get_pokemon_abilities_data(ability_url):
    response = requests.get(ability_url)
    response.raise_for_status()
    data = response.json()

    if not data.get("is_main_series", False):
        return []

    ability_id = data["id"]
    ability_name = data["name"]
    rows = []

    for entry in data.get("pokemon", []):
        pokemon = entry.get("pokemon", {})
        pokemon_name = pokemon.get("name", "")
        pokemon_url = pokemon.get("url", "")
        pokemon_id = None

        if pokemon_url:
            try:
                pokemon_response = requests.get(pokemon_url)
                pokemon_response.raise_for_status()
                pokemon_data = pokemon_response.json()
                pokemon_id = pokemon_data.get("id")
            except Exception:
                pokemon_id = None

        rows.append(
            [
                pokemon_id,
                pokemon_name,
                ability_name,
                ability_id,
                entry.get("slot", 0),
                entry.get("is_hidden", False),
            ]
        )

    return rows


def build_rows():
    rows = []
    ability_list = get_all_abilities()

    for i, ability in enumerate(ability_list):
        try:
            rows.extend(get_pokemon_abilities_data(ability["url"]))
            print(f"[{i + 1}/{len(ability_list)}] Processado: {ability['name']}")
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


def save_sql(rows, filename="008_pokemon_abilities.sql"):
    script_dir = os.path.dirname(os.path.abspath(__file__))
    migrations_dir = os.path.abspath(os.path.join(script_dir, "..", "migrations"))
    filepath = os.path.join(migrations_dir, filename)

    os.makedirs(migrations_dir, exist_ok=True)

    create_table_sql = """DROP TABLE IF EXISTS pokemon_abilities;

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
"""

    insert_statements = []
    for row in rows:
        values = ", ".join(format_sql_value(value) for value in row)
        insert_statements.append(f"INSERT INTO pokemon_abilities VALUES ({values});")

    with open(filepath, "w", encoding="utf-8", newline="") as f:
        f.write(create_table_sql)
        f.write("\n")
        f.write("\n".join(insert_statements))
        f.write("\n")

    print(f"\nSQL salvo em: {filepath}")


if __name__ == "__main__":
    rows = build_rows()
    save_sql(rows)