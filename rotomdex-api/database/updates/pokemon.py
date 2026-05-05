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
    # Use the species identifier for the Pokédex numeral so alternate forms
    # like Mega evolutions keep the same entry number as their base species.    
    return [pokemon_id, pokemon_name, species_id, primary_type, secondary_type, hp, attack, defense, special_attack, special_defense, speed, bst, height, weight, base_experience]

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
        writer.writerow(["id", "name", "species_id", "primary_type", "secondary_type", "hp", "attack", "defense", "special_attack", "special_defense", "speed", "bst", "height", "weight", "base_experience"])
        writer.writerows(rows)

    print(f"\nCSV salvo em: {filepath}")

if __name__ == "__main__":
    rows = build_rows()
    save_csv(rows)
