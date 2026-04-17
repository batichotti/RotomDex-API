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
