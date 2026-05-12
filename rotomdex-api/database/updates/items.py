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
	item_attributes = [attribute["name"] for attribute in data.get("attributes", [])]
	held_by_pokemon = [
		{
			"pokemon": entry["pokemon"]["name"],
			"version_details": [
				{
					"rarity": detail.get("rarity", 0),
					"version": detail["version"]["name"] if detail.get("version") else "",
				}
				for detail in entry.get("version_details", [])
			],
		}
		for entry in data.get("held_by_pokemon", [])
	]
	baby_trigger_for = data["baby_trigger_for"]["name"] if data.get("baby_trigger_for") else ""
	machine = data["machines"][0]["machine"]["url"] if data.get("machines") else ""

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
		"attributes": item_attributes,
		"held_by_pokemon": held_by_pokemon,
		"baby_trigger_for": baby_trigger_for,
		"machine": machine,
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


def save_json(items, filename="items.json"):
	script_dir = os.path.dirname(os.path.abspath(__file__))
	filepath = os.path.join(script_dir, filename)

	with open(filepath, "w", encoding="utf-8") as f:
		json.dump(items, f, ensure_ascii=False, indent=2)

	print(f"\nJSON salvo em: {filepath}")


if __name__ == "__main__":
	items = build_items()
	save_json(items)
