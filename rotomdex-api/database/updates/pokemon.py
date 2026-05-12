import requests
import time
import csv
import os

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
    species_url = data["species"]["url"]
    
    species_response = requests.get(species_url)
    species_response.raise_for_status()
    species_data = species_response.json()

    primary_type = data["types"][0]["type"]["name"] if data["types"] else ""
    secondary_type = data["types"][1]["type"]["name"] if len(data["types"]) > 1 else "None"
    
    hp = next((stat["base_stat"] for stat in data["stats"] if stat["stat"]["name"] == "hp"), 0)
    attack = next((stat["base_stat"] for stat in data["stats"] if stat["stat"]["name"] == "attack"), 0)
    defense = next((stat["base_stat"] for stat in data["stats"] if stat["stat"]["name"] == "defense"), 0)
    special_attack = next((stat["base_stat"] for stat in data["stats"] if stat["stat"]["name"] == "special-attack"), 0)
    special_defense = next((stat["base_stat"] for stat in data["stats"] if stat["stat"]["name"] == "special-defense"), 0)
    speed = next((stat["base_stat"] for stat in data["stats"] if stat["stat"]["name"] == "speed"), 0)
    
    bst = hp + attack + defense + special_attack + special_defense + speed
    height = data["height"]*10
    weight = data["weight"]/10
    base_experience = data["base_experience"] if data["base_experience"] else 0
    species_id = species_data["id"]
    species_name = species_data["name"]
    variety_name = data["name"]
    generation = species_data["generation"]["name"] if species_data.get("generation") else ""
    is_legendary = species_data.get("is_legendary", False)
    is_mythical = species_data.get("is_mythical", False)
    is_baby = species_data.get("is_baby", False)
    has_gender_differences = species_data.get("has_gender_differences", False)
    forms_switchable = species_data.get("forms_switchable", False)
    is_mega = "mega" in variety_name
    is_gmax = "gmax" in variety_name or "gigantamax" in variety_name
    is_regional_form = any(region in variety_name for region in ["alola", "galar", "hisui", "paldea"])

    egg_groups = species_data.get("egg_groups", [])
    egg_group_1 = egg_groups[0]["name"] if len(egg_groups) > 0 else "None"
    egg_group_2 = egg_groups[1]["name"] if len(egg_groups) > 1 else "None"

    return [
        pokemon_id,
        pokemon_name,
        species_id,
        species_name,
        generation,
        is_legendary,
        is_mythical,
        is_baby,
        has_gender_differences,
        forms_switchable,
        is_mega,
        is_gmax,
        is_regional_form,
        egg_group_1,
        egg_group_2,
        primary_type,
        secondary_type,
        hp,
        attack,
        defense,
        special_attack,
        special_defense,
        speed,
        bst,
        height,
        weight,
        base_experience,
    ]

def build_rows():
    rows = []
    pokemon_list = get_all_pokemon()

    for i, pokemon in enumerate(pokemon_list):
        url = pokemon["url"]

        try:
            row = get_pokemon_data(url)
            rows.append(row)

            print(f"[{i+1}/{len(pokemon_list)}] Processado: {pokemon['name']}")
            time.sleep(0.1)

        except Exception as e:
            print(f"Erro: {e}")

    return rows

def save_csv(rows, filename="pokemon.csv"):
    script_dir = os.path.dirname(os.path.abspath(__file__))
    filepath = os.path.join(script_dir, filename)

    with open(filepath, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            "id",
            "name",
            "species_id",
            "species_name",
            "generation",
            "is_legendary",
            "is_mythical",
            "is_baby",
            "has_gender_differences",
            "forms_switchable",
            "is_mega",
            "is_gmax",
            "is_regional_form",
            "egg_group_1",
            "egg_group_2",
            "primary_type",
            "secondary_type",
            "hp",
            "attack",
            "defense",
            "special_attack",
            "special_defense",
            "speed",
            "bst",
            "height",
            "weight",
            "base_experience",
        ])
        writer.writerows(rows)

    print(f"\nCSV salvo em: {filepath}")

if __name__ == "__main__":
    rows = build_rows()
    save_csv(rows)
