DROP TABLE IF EXISTS abilities;

CREATE TABLE abilities (
	id SERIAL PRIMARY KEY,
	name TEXT NOT NULL,
	generation_introduced TEXT NOT NULL,
	description TEXT NOT NULL,
	short_description TEXT NOT NULL
);
