import csv
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

	# Load local pokemon CSV to map names to ids
	script_dir = os.path.dirname(os.path.abspath(__file__))
	pokemon_csv_path = os.path.join(script_dir, "pokemon.csv")
	pokemon_name_to_id = {}
	if os.path.exists(pokemon_csv_path):
		try:
			with open(pokemon_csv_path, newline="", encoding="utf-8") as pcsv:
				reader = csv.DictReader(pcsv)
				for row in reader:
					name = row.get("name")
					pid = row.get("id")
					if name and pid:
						pokemon_name_to_id[name] = int(pid)
		except Exception:
			pass

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
				# prefer id from local csv mapping, fallback to any pokemon_id in entry
				pokemon_id = pokemon_name_to_id.get(pokemon_name) if pokemon_name else None
				if pokemon_id is None:
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


def save_csv(rows, filename, headers):
	script_dir = os.path.dirname(os.path.abspath(__file__))
	filepath = os.path.join(script_dir, filename)

	with open(filepath, "w", newline="", encoding="utf-8") as f:
		writer = csv.writer(f)
		writer.writerow(headers)
		writer.writerows(rows)

	print(f"\nCSV salvo em: {filepath}")


if __name__ == "__main__":
	abilities_rows, pokemon_has_abilities_rows = build_rows()
	save_csv(
		abilities_rows,
		"abilities.csv",
		[
			"id",
			"name",
			"is_main_series",
			"generation_introduced",
			"description",
			"short_description",
		],
	)
	save_csv(
		pokemon_has_abilities_rows,
		"pokemon_has_abilities.csv",
		[
			"pokemon_id",
			"pokemon_name",
			"ability_name",
			"ability_id",
			"ability_slot",
			"is_hidden",
		],
	)
