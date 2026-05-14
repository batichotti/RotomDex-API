import os
import time

import requests

BASE_URL = "https://pokeapi.co/api/v2"


def get_all_moves():
	url = f"{BASE_URL}/move?limit=10000"
	response = requests.get(url)
	response.raise_for_status()
	return response.json()["results"]


def get_move_data(move_url):
	response = requests.get(move_url)
	response.raise_for_status()
	data = response.json()

	move_id = data["id"]
	move_name = data["name"]
	accuracy = data["accuracy"] if data["accuracy"] is not None else 0
	power = data["power"] if data["power"] is not None else 0
	move_type = data["type"]["name"] if data.get("type") else ""
	pp = data["pp"] if data["pp"] is not None else 0
	effect_chance = data["effect_chance"] if data["effect_chance"] is not None else 0
	priority = data["priority"] if data["priority"] is not None else 0
	damage_class = data["damage_class"]["name"] if data.get("damage_class") else ""
	generation_introduced = data["generation"]["name"] if data.get("generation") else ""

	description = ""
	short_description = ""
	for entry in data.get("flavor_text_entries", []):
		if entry.get("language", {}).get("name") == "en":
			text = entry.get("flavor_text", "").replace("\n", " ").replace("\f", " ")
			description = text
			short_description = text
			break

	category = data["meta"]["category"]["name"] if data.get("meta") and data["meta"].get("category") else ""

	return [
		move_id,
		move_name,
		accuracy,
		power,
		move_type,
		pp,
		effect_chance,
		priority,
		damage_class,
		generation_introduced,
		description,
		short_description,
		category,
	]


def build_rows():
	rows = []
	move_list = get_all_moves()

	for i, move in enumerate(move_list):
		url = move["url"]

		try:
			row = get_move_data(url)
			rows.append(row)

			print(f"[{i + 1}/{len(move_list)}] Processado: {move['name']}")
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


def save_sql(rows, filename="002_moves.sql"):
	script_dir = os.path.dirname(os.path.abspath(__file__))
	migrations_dir = os.path.abspath(os.path.join(script_dir, "..", "migrations"))
	filepath = os.path.join(migrations_dir, filename)

	os.makedirs(migrations_dir, exist_ok=True)

	create_table_sql = """DROP TABLE IF EXISTS moves;

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
);
"""

	insert_statements = []
	for row in rows:
		values = ", ".join(format_sql_value(value) for value in row)
		insert_statements.append(f"INSERT INTO moves VALUES ({values});")

	with open(filepath, "w", encoding="utf-8", newline="") as f:
		f.write(create_table_sql)
		f.write("\n")
		f.write("\n".join(insert_statements))
		f.write("\n")

	print(f"\nSQL salvo em: {filepath}")


if __name__ == "__main__":
	rows = build_rows()
	save_sql(rows)
