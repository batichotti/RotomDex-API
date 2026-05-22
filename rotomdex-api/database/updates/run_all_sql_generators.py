from pathlib import Path
import subprocess
import sys


SCRIPT_DIR = Path(__file__).resolve().parent


GENERATORS = [
	"pokemon.py",
	"moves.py",
	"abilities.py",
	"items.py",
	"types.py",
	"pokemon_abilities.py",
	"pokemon_moves.py",
]


def run_generator(script_name):
	script_path = SCRIPT_DIR / script_name
	print(f"Running {script_name}...")
	subprocess.run([sys.executable, str(script_path)], check=True)


def main():
	for script_name in GENERATORS:
		run_generator(script_name)

	print("\nAll SQL generators finished successfully.")


if __name__ == "__main__":
	main()