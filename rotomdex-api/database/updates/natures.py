import os
import time

import requests

BASE_URL = "https://pokeapi.co/api/v2"


def get_all_natures():
	url = f"{BASE_URL}/nature?limit=10000"
	response = requests.get(url)
	response.raise_for_status()
	return response.json()["results"]


def get_nature_data(nature_url):
	response = requests.get(nature_url)
	response.raise_for_status()
	data = response.json()

	nature_name = data["name"]
	decreased_stat = data["decreased_stat"]["name"] if data.get("decreased_stat") else ""
	hates_flavor = data["hates_flavor"]["name"] if data.get("hates_flavor") else ""
	increased_stat = data["increased_stat"]["name"] if data.get("increased_stat") else ""
	likes_flavor = data["likes_flavor"]["name"] if data.get("likes_flavor") else ""

	return [
		nature_name,
		decreased_stat,
		hates_flavor,
		increased_stat,
		likes_flavor,
	]


def build_rows():
	rows = []
	nature_list = get_all_natures()

	for i, nature in enumerate(nature_list):
		url = nature["url"]

		try:
			row = get_nature_data(url)
			rows.append(row)

			print(f"[{i + 1}/{len(nature_list)}] Processado: {nature['name']}")
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


def save_sql(rows, filename="006_natures.sql"):
	script_dir = os.path.dirname(os.path.abspath(__file__))
	migrations_dir = os.path.abspath(os.path.join(script_dir, "..", "migrations"))
	filepath = os.path.join(migrations_dir, filename)

	os.makedirs(migrations_dir, exist_ok=True)

	create_table_sql = """DROP TABLE IF EXISTS natures;

CREATE TABLE natures (
	name TEXT PRIMARY KEY,
	decreased_stat TEXT,
	hates_flavor TEXT,
	increased_stat TEXT,
	likes_flavor TEXT
);
"""

	insert_statements = []
	for row in rows:
		values = ", ".join(format_sql_value(value) for value in row)
		insert_statements.append(f"INSERT INTO natures VALUES ({values});")

	with open(filepath, "w", encoding="utf-8", newline="") as f:
		f.write(create_table_sql)
		f.write("\n")
		f.write("\n".join(insert_statements))
		f.write("\n")

	print(f"\nSQL salvo em: {filepath}")


if __name__ == "__main__":
	rows = build_rows()
	save_sql(rows)
