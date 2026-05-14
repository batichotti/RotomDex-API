import json
import os
import time

import requests

BASE_URL = "https://pokeapi.co/api/v2"


def get_all_abilities():
	url = f"{BASE_URL}/ability?limit=10000"
	response = requests.get(url)
	response.raise_for_status()
	return response.json()["results"]


def get_ability_data(ability_url):
	response = requests.get(ability_url)
	response.raise_for_status()
	data = response.json()

	ability_id = data["id"]
	ability_name = data["name"]
	is_main_series = data.get("is_main_series", False)
	generation_introduced = data["generation"]["name"] if data.get("generation") else ""

	description = ""
	short_description = ""
	for entry in data.get("effect_entries", []):
		if entry.get("language", {}).get("name") == "en":
			text = entry.get("effect", "").replace("\n", " ").replace("\f", " ")
			description = text
			short_description = text
			break

	# Fetch pokemon data with their IDs
	pokemon_entries = []
	for entry in data.get("pokemon", []):
		pokemon_url = entry.get("pokemon", {}).get("url", "")
		if pokemon_url:
			try:
				pokemon_response = requests.get(pokemon_url)
				pokemon_response.raise_for_status()
				pokemon_data = pokemon_response.json()
				entry["pokemon_id"] = pokemon_data["id"]
			except Exception:
				entry["pokemon_id"] = None
		pokemon_entries.append(entry)

	return [
		ability_id,
		ability_name,
		is_main_series,
		generation_introduced,
		description,
		short_description,
		pokemon_entries,
	]


def build_rows():
	abilities_rows = []
	pokemon_has_abilities_rows = []
	ability_list = get_all_abilities()

	for i, ability in enumerate(ability_list):
		url = ability["url"]

		try:
			ability_id, ability_name, is_main_series, generation_introduced, description, short_description, pokemon_entries = get_ability_data(url)

			# Skip abilities that are not part of the main series
			if not is_main_series:
				continue
			abilities_rows.append([
				ability_id,
				ability_name,
				generation_introduced,
				description,
				short_description,
			])

			for entry in pokemon_entries:
				pokemon = entry.get("pokemon", {})
				pokemon_name = pokemon.get("name", "")
				pokemon_id = entry.get("pokemon_id")

				pokemon_has_abilities_rows.append([
					pokemon_id,
					pokemon_name,
					ability_name,
					ability_id,
					entry.get("slot", 0),
					entry.get("is_hidden", False),
				])

			print(f"[{i + 1}/{len(ability_list)}] Processado: {ability['name']}")
			time.sleep(0.1)

		except Exception as e:
			print(f"Erro: {e}")

	return abilities_rows, pokemon_has_abilities_rows


def format_sql_value(value):
	if value is None:
		return "NULL"
	if isinstance(value, bool):
		return "TRUE" if value else "FALSE"
	if isinstance(value, (list, dict, tuple)):
		value = json.dumps(value, ensure_ascii=False)
	if isinstance(value, str):
		escaped = value.replace("'", "''")
		return f"'{escaped}'"
	return str(value)


def save_sql(rows, filename, table_name, create_table_sql):
	script_dir = os.path.dirname(os.path.abspath(__file__))
	migrations_dir = os.path.abspath(os.path.join(script_dir, "..", "migrations"))
	filepath = os.path.join(migrations_dir, filename)

	os.makedirs(migrations_dir, exist_ok=True)

	insert_statements = []
	for row in rows:
		values = ", ".join(format_sql_value(value) for value in row)
		insert_statements.append(f"INSERT INTO {table_name} VALUES ({values});")

	with open(filepath, "w", encoding="utf-8", newline="") as f:
		f.write(create_table_sql)
		f.write("\n")
		f.write("\n".join(insert_statements))
		f.write("\n")

	print(f"\nSQL salvo em: {filepath}")


def save_abilities_sql(rows, filename="003_abilities.sql"):
	create_table_sql = """DROP TABLE IF EXISTS abilities;

CREATE TABLE abilities (
	id SERIAL PRIMARY KEY,
	name TEXT NOT NULL,
	generation_introduced TEXT NOT NULL,
	description TEXT NOT NULL,
	short_description TEXT NOT NULL
);
"""
	save_sql(rows, filename, "abilities", create_table_sql)


def save_pokemon_abilities_sql(rows, filename="005_pokemon_abilities.sql"):
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
	save_sql(rows, filename, "pokemon_abilities", create_table_sql)


if __name__ == "__main__":
	abilities_rows, _ = build_rows()
	save_abilities_sql(abilities_rows)
