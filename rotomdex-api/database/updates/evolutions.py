# <- This guy dont take regional forms, we fixed it manually at the .sql file
import os
import time
from dataclasses import astuple, dataclass
from typing import Optional

import requests

BASE_URL = "https://pokeapi.co/api/v2"
REQUEST_DELAY = 0.1


@dataclass(frozen=True)
class EvolutionRow:
    pokemon_name: str
    pokemon_id: Optional[int]
    species_id: Optional[int]
    evolves_from_name: Optional[str]
    evolves_from_id: Optional[int]
    evolves_from_species_id: Optional[int]
    evolution_method: str
    evolution_stage: int
    is_fully_evolved: bool


# ---------------------------------------------------------------------------
# API helpers
# ---------------------------------------------------------------------------

def fetch_json(url: str) -> dict:
    response = requests.get(url)
    response.raise_for_status()
    return response.json()


def get_all_pokemon() -> list[dict]:
    return fetch_json(f"{BASE_URL}/pokemon?limit=10000")["results"]


def get_pokemon_data(pokemon_url: str) -> tuple[str, int, int, dict]:
    data = fetch_json(pokemon_url)
    species_data = fetch_json(data["species"]["url"])
    return data["name"], data["id"], species_data["id"], species_data


def fetch_ids_for_name(pokemon_name: str) -> tuple[int, int]:
    data = fetch_json(f"{BASE_URL}/pokemon/{pokemon_name}")
    species_data = fetch_json(data["species"]["url"])
    return data["id"], species_data["id"]


# ---------------------------------------------------------------------------
# Evolution chain helpers
# ---------------------------------------------------------------------------

def format_evolution_method(details: list) -> str:
    if not details:
        return ""

    detail = details[0]
    parts = []

    if trigger := detail.get("trigger"):
        parts.append(trigger["name"])
    if detail.get("min_level") is not None:
        parts.append(f"level={detail['min_level']}")
    if item := detail.get("item"):
        parts.append(f"item={item['name']}")
    if held := detail.get("held_item"):
        parts.append(f"held_item={held['name']}")
    if move := detail.get("known_move"):
        parts.append(f"move={move['name']}")
    if move_type := detail.get("known_move_type"):
        parts.append(f"move_type={move_type['name']}")
    if location := detail.get("location"):
        parts.append(f"location={location['name']}")
    if tod := detail.get("time_of_day"):
        parts.append(f"time={tod}")
    if trade := detail.get("trade_species"):
        parts.append(f"trade_species={trade['name']}")
    if detail.get("gender") is not None:
        parts.append(f"gender={detail['gender']}")
    if detail.get("needs_overworld_rain"):
        parts.append("needs_overworld_rain=true")
    if detail.get("turn_upside_down"):
        parts.append("turn_upside_down=true")

    return " | ".join(parts)


def _make_row(
    pokemon_name: str,
    pokemon_id: Optional[int],
    species_id: Optional[int],
    evolves_from_name: Optional[str],
    evolution_method: str,
    evolution_stage: int,
    is_fully_evolved: bool,
) -> EvolutionRow:
    return EvolutionRow(
        pokemon_name=pokemon_name,
        pokemon_id=pokemon_id,
        species_id=species_id,
        evolves_from_name=evolves_from_name,
        evolves_from_id=None,
        evolves_from_species_id=None,
        evolution_method=evolution_method,
        evolution_stage=evolution_stage,
        is_fully_evolved=is_fully_evolved,
    )


def walk_chain(chain: dict, stage: int, rows: list[EvolutionRow], parent_name: str) -> None:
    name = chain["species"]["name"]
    is_leaf = len(chain.get("evolves_to", [])) == 0

    rows.append(_make_row(
        pokemon_name=name,
        pokemon_id=None,
        species_id=None,
        evolves_from_name=parent_name,
        evolution_method=format_evolution_method(chain.get("evolution_details", [])),
        evolution_stage=stage,
        is_fully_evolved=is_leaf,
    ))

    for next_stage in chain.get("evolves_to", []):
        walk_chain(next_stage, stage + 1, rows, name)


def rows_from_chain(chain: dict) -> list[EvolutionRow]:
    rows: list[EvolutionRow] = []
    base_name = chain["species"]["name"]
    is_leaf = len(chain.get("evolves_to", [])) == 0

    rows.append(_make_row(
        pokemon_name=base_name,
        pokemon_id=None,
        species_id=None,
        evolves_from_name=None,
        evolution_method="",
        evolution_stage=1,
        is_fully_evolved=is_leaf,
    ))

    for next_stage in chain.get("evolves_to", []):
        walk_chain(next_stage, 2, rows, base_name)

    return rows


# ---------------------------------------------------------------------------
# Main build
# ---------------------------------------------------------------------------

def _resolve_ids(name: str, id_cache: dict[str, tuple[int, int]]) -> tuple[int, int]:
    if name not in id_cache:
        pid, sid = fetch_ids_for_name(name)
        id_cache[name] = (pid, sid)
        time.sleep(REQUEST_DELAY)
    return id_cache[name]


def build_rows() -> list[EvolutionRow]:
    pokemon_list = get_all_pokemon()
    rows: list[EvolutionRow] = []
    id_cache: dict[str, tuple[int, int]] = {}
    seen: set[str] = set()

    for i, pokemon in enumerate(pokemon_list):
        try:
            name, pokemon_id, species_id, species_data = get_pokemon_data(pokemon["url"])
            id_cache[name] = (pokemon_id, species_id)

            chain_url = species_data.get("evolution_chain", {}).get("url")
            if not chain_url:
                continue

            chain = fetch_json(chain_url)["chain"]
            if chain["species"]["name"] != name:
                time.sleep(REQUEST_DELAY)
                continue

            for row in rows_from_chain(chain):
                if row.pokemon_name not in seen:
                    seen.add(row.pokemon_name)
                    rows.append(row)

            print(f"[{i + 1}/{len(pokemon_list)}] Processado: {name}")
            time.sleep(REQUEST_DELAY)

        except Exception as e:
            print(f"Erro ao processar {pokemon['name']}: {e}")

    # ------------------------------------------------------------------
    # Second pass: preenche pokemon_id, species_id, evolves_from_id e
    # evolves_from_species_id usando o id_cache (com fallback para API).
    # ------------------------------------------------------------------
    filled: list[EvolutionRow] = []
    for row in rows:
        # IDs do próprio Pokémon
        try:
            pid, sid = _resolve_ids(row.pokemon_name, id_cache)
            if row.pokemon_id is None:
                print(f"  IDs preenchidos: {row.pokemon_name} → pokemon_id={pid}, species_id={sid}")
        except Exception as e:
            print(f"  Erro ao buscar IDs de {row.pokemon_name}: {e}")
            filled.append(row)
            continue

        # IDs do antecessor (apenas quando evolves_from_name não é NULL)
        from_pid: Optional[int] = None
        from_sid: Optional[int] = None
        if row.evolves_from_name is not None:
            try:
                from_pid, from_sid = _resolve_ids(row.evolves_from_name, id_cache)
                print(f"  IDs do antecessor: {row.evolves_from_name} → pokemon_id={from_pid}, species_id={from_sid}")
            except Exception as e:
                print(f"  Erro ao buscar IDs do antecessor {row.evolves_from_name}: {e}")

        filled.append(EvolutionRow(
            pokemon_name=row.pokemon_name,
            pokemon_id=pid,
            species_id=sid,
            evolves_from_name=row.evolves_from_name,
            evolves_from_id=from_pid,
            evolves_from_species_id=from_sid,
            evolution_method=row.evolution_method,
            evolution_stage=row.evolution_stage,
            is_fully_evolved=row.is_fully_evolved,
        ))

    return filled


# ---------------------------------------------------------------------------
# SQL output
# ---------------------------------------------------------------------------

CREATE_TABLE_SQL = """\
DROP TABLE IF EXISTS pokemon_evolutions CASCADE;

CREATE TABLE pokemon_evolutions (
    pokemon_name            TEXT NOT NULL,
    pokemon_id              INTEGER PRIMARY KEY,
    species_id              INTEGER NOT NULL,
    evolves_from_name       TEXT,
    evolves_from_id         INTEGER,
    evolves_from_species_id INTEGER,
    evolution_method        TEXT,
    evolution_stage         SMALLINT NOT NULL,
    is_fully_evolved        BOOLEAN NOT NULL
);
"""


def _sql_value(value) -> str:
    if value is None:
        return "NULL"
    if isinstance(value, bool):
        return "TRUE" if value else "FALSE"
    if isinstance(value, str):
        return f"'{value.replace(chr(39), chr(39) * 2)}'"
    return str(value)


def rows_to_insert_sql(rows: list[EvolutionRow]) -> list[str]:
    statements = []
    for row in rows:
        values = ", ".join(_sql_value(v) for v in astuple(row))
        statements.append(f"INSERT INTO pokemon_evolutions VALUES ({values});")
    return statements


def save_sql(rows: list[EvolutionRow], filename: str = "007_pokemon_evolutions.sql") -> None:
    migrations_dir = os.path.abspath(
        os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "migrations")
    )
    os.makedirs(migrations_dir, exist_ok=True)
    filepath = os.path.join(migrations_dir, filename)

    with open(filepath, "w", encoding="utf-8", newline="") as f:
        f.write(CREATE_TABLE_SQL)
        f.write("\n")
        f.write("\n".join(rows_to_insert_sql(rows)))
        f.write("\n")

    print(f"\nSQL salvo em: {filepath}")


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    save_sql(build_rows())
