import json
import os
import time

import requests

BASE_URL = "https://pokeapi.co/api/v2"


def get_all_items():
	url = f"{BASE_URL}/item?limit=10000"
	response = requests.get(url)
	response.raise_for_status()
	return response.json()["results"]


def get_item_data(item_url):
	response = requests.get(item_url)
	response.raise_for_status()
	data = response.json()

	item_id = data["id"]
	item_name = data["name"]
	cost = data["cost"] if data.get("cost") is not None else 0
	fling_power = data["fling_power"] if data.get("fling_power") is not None else 0
	item_category = data["category"]["name"] if data.get("category") else ""

	description = ""
	for entry in data.get("flavor_text_entries", []):
		if entry.get("language", {}).get("name") == "en":
			description = entry.get("text", "").replace("\n", " ").replace("\f", " ")
			break

	return {
		"id": item_id,
		"name": item_name,
		"cost": cost,
		"fling_power": fling_power,
		"category": item_category,
		"description": description,
	}


def build_items():
	items = []
	item_list = get_all_items()

	for i, item in enumerate(item_list):
		try:
			items.append(get_item_data(item["url"]))
			print(f"[{i + 1}/{len(item_list)}] Processado: {item['name']}")
			time.sleep(0.1)
		except Exception as e:
			print(f"Erro: {e}")

	return items


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


def save_sql(items, filename="004_items.sql"):
	script_dir = os.path.dirname(os.path.abspath(__file__))
	migrations_dir = os.path.abspath(os.path.join(script_dir, "..", "migrations"))
	filepath = os.path.join(migrations_dir, filename)

	os.makedirs(migrations_dir, exist_ok=True)

	create_table_sql = """DROP TABLE IF EXISTS items;

CREATE TABLE items (
	id INTEGER PRIMARY KEY,
	name TEXT NOT NULL,
	cost INTEGER NOT NULL,
	fling_power INTEGER NOT NULL,
	category TEXT NOT NULL,
	description TEXT NOT NULL
);
"""

	insert_statements = []
	for item in items:
		row = [
			item["id"],
			item["name"],
			item["cost"],
			item["fling_power"],
			item["category"],
			item["description"],
		]
		values = ", ".join(format_sql_value(value) for value in row)
		insert_statements.append(f"INSERT INTO items VALUES ({values});")

	with open(filepath, "w", encoding="utf-8", newline="") as f:
		f.write(create_table_sql)
		f.write("\n")
		f.write("\n".join(insert_statements))
		f.write("\n")

	print(f"\nSQL salvo em: {filepath}")


if __name__ == "__main__":
	items = build_items()
	save_sql(items)
