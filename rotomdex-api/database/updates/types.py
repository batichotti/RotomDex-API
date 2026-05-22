tipos = [
    "Normal", "Fighting", "Flying", "Poison", "Ground", "Rock",
    "Insect", "Ghost", "Steel", "Fire", "Water", "Grass",
    "Electric", "Psychic", "Ice", "Dragon", "Dark", "Fairy"
]

# Matriz de efetividade: ataque (linha) x defesa (coluna)
# Ordem das colunas (defesa): Normal, Fighting, Flying, Poison, Ground, Rock, Insect, Ghost, Steel, Fire, Water, Grass, Electric, Psychic, Ice, Dragon, Dark, Fairy

data = {
#              Nor  Lut  Voa  Ven  Ter  Ped  Ins  Fan  Steel  Fog  Águ  Pla  Elé  Psí  Gel  Dra  Som  Fad
"Normal":    [  1,   1,   1,   1,   1, 0.5,   1,   0, 0.5,   1,   1,   1,   1,   1,   1,   1,   1,   1],
"Fighting":   [  2,   1, 0.5, 0.5,   1,   2, 0.5,   0,   2,   1,   1,   1,   1, 0.5,   2,   1,   2, 0.5],
"Flying":    [  1,   2,   1,   1,   1, 0.5,   2,   1, 0.5,   1,   1,   2, 0.5,   1,   1,   1,   1,   1],
"Poison":  [  1,   1,   1, 0.5, 0.5, 0.5,   1, 0.5,   0,   1,   1,   2,   1,   1,   1,   1,   1,   2],
"Ground": [  1,   1,   0,   2,   1,   2, 0.5,   1,   2,   2,   1, 0.5,   2,   1,   1,   1,   1,   1],
"Rock":     [  1, 0.5,   2,   1,   0.5, 1,   2,   1, 0.5,   2,   1,   1,   1,   1,   2,   1,   1,   1],
"Insect":    [  1, 0.5, 0.5, 0.5,   1,   1,   1, 0.5, 0.5, 0.5,   1,   2,   1,   2,   1,   1,   2, 0.5],
"Ghost":  [  0,   1,   1,   1,   1,   1,   1,   2,   1,   1,   1,   1,   1,   2,   1,   1, 0.5,   1],
"Steel":       [  1,   1,   1,   1,   1,   2,   1,   1, 0.5, 0.5,   1,   1, 0.5,   1,   2,   1,   1,   2],
"Fire":      [  1,   1,   1,   1,   1, 0.5,   2,   1,   2, 0.5, 0.5,   2,   1,   1,   2, 0.5,   1,   1],
"Water":      [  1,   1,   1,   1,   2,   2,   1,   1,   1,   2, 0.5, 0.5,   1,   1,   1, 0.5,   1,   1],
"Grass":    [  1,   1, 0.5, 0.5,   2,   2, 0.5,   1, 0.5, 0.5,   2, 0.5,   1,   1,   1, 0.5,   1,   1],
"Electric":  [  1,   1,   2,   1,   0,   1,   1,   1,   1,   1,   2, 0.5,   2, 0.5 ,   1, 0.5,   1,   1],
"Psychic":  [  1,   2,   1,   2,   1,   1,   1,   1, 0.5,   1,   1,   1,   1, 0.5,   1,   1,   0,   1],
"Ice":      [  1,   1,   2,   1,   2,   1,   1,   1, 0.5, 0.5,   1, 0.5 , 0.5,  1 ,   1, 0.5, 0.5, 1  ],
"Dragon":    [  1,   1,   1,   1,   1,   1,   1,   1, 0.5,   1,   1,   1,   1,   1,   1,   2,   1,   0],
"Dark":   [  1, 0.5,   1,   1,   1,   1,   1,   2,   1,   1,   1,   1,   1,   2,   1,   1, 0.5, 0.5],
"Fairy":      [  1,   2,   1, 0.5,   1,   1,   1,   1, 0.5,   1,   1,   1,   1,   1,   1,   2,   2,   1],
}


def format_sql_value(value):
    if value is None:
        return "NULL"
    if isinstance(value, bool):
        return "TRUE" if value else "FALSE"
    if isinstance(value, str):
        escaped = value.replace("'", "''")
        return f"'{escaped}'"
    return str(value)


def build_rows():
    rows = []
    for ataque in tipos:
        for defesa, effectiveness in zip(tipos, data[ataque]):
            rows.append((ataque, defesa, effectiveness))
    return rows


def save_sql(filename="005_types.sql"):
    import os

    script_dir = os.path.dirname(os.path.abspath(__file__))
    migrations_dir = os.path.abspath(os.path.join(script_dir, "..", "migrations"))
    filepath = os.path.join(migrations_dir, filename)

    os.makedirs(migrations_dir, exist_ok=True)

    create_table_sql = """DROP TABLE IF EXISTS types;

CREATE TABLE types (
    attack_type TEXT NOT NULL,
    defense_type TEXT NOT NULL,
    effectiveness REAL NOT NULL
);
"""

    insert_statements = []
    for ataque, defesa, effectiveness in build_rows():
        values = ", ".join(
            format_sql_value(value)
            for value in (ataque, defesa, effectiveness)
        )
        insert_statements.append(f"INSERT INTO types VALUES ({values});")

    with open(filepath, "w", encoding="utf-8", newline="") as f:
        f.write(create_table_sql)
        f.write("\n")
        f.write("\n".join(insert_statements))
        f.write("\n")

    print(f"\nSQL salvo em: {filepath}")


if __name__ == "__main__":
    save_sql()