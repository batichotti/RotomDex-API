DROP TABLE IF EXISTS natures CASCADE;

CREATE TABLE natures (
	name TEXT PRIMARY KEY,
	decreased_stat TEXT,
	hates_flavor TEXT,
	increased_stat TEXT,
	likes_flavor TEXT
);

INSERT INTO natures VALUES ('hardy', '', '', '', '');
INSERT INTO natures VALUES ('bold', 'attack', 'spicy', 'defense', 'sour');
INSERT INTO natures VALUES ('modest', 'attack', 'spicy', 'special-attack', 'dry');
INSERT INTO natures VALUES ('calm', 'attack', 'spicy', 'special-defense', 'bitter');
INSERT INTO natures VALUES ('timid', 'attack', 'spicy', 'speed', 'sweet');
INSERT INTO natures VALUES ('docile', '', '', '', '');
INSERT INTO natures VALUES ('lonely', 'defense', 'sour', 'attack', 'spicy');
INSERT INTO natures VALUES ('mild', 'defense', 'sour', 'special-attack', 'dry');
INSERT INTO natures VALUES ('gentle', 'defense', 'sour', 'special-defense', 'bitter');
INSERT INTO natures VALUES ('hasty', 'defense', 'sour', 'speed', 'sweet');
INSERT INTO natures VALUES ('bashful', '', '', '', '');
INSERT INTO natures VALUES ('adamant', 'special-attack', 'dry', 'attack', 'spicy');
INSERT INTO natures VALUES ('impish', 'special-attack', 'dry', 'defense', 'sour');
INSERT INTO natures VALUES ('careful', 'special-attack', 'dry', 'special-defense', 'bitter');
INSERT INTO natures VALUES ('jolly', 'special-attack', 'dry', 'speed', 'sweet');
INSERT INTO natures VALUES ('quirky', '', '', '', '');
INSERT INTO natures VALUES ('naughty', 'special-defense', 'bitter', 'attack', 'spicy');
INSERT INTO natures VALUES ('lax', 'special-defense', 'bitter', 'defense', 'sour');
INSERT INTO natures VALUES ('rash', 'special-defense', 'bitter', 'special-attack', 'dry');
INSERT INTO natures VALUES ('naive', 'special-defense', 'bitter', 'speed', 'sweet');
INSERT INTO natures VALUES ('serious', '', '', '', '');
INSERT INTO natures VALUES ('brave', 'speed', 'sweet', 'attack', 'spicy');
INSERT INTO natures VALUES ('relaxed', 'speed', 'sweet', 'defense', 'sour');
INSERT INTO natures VALUES ('quiet', 'speed', 'sweet', 'special-attack', 'dry');
INSERT INTO natures VALUES ('sassy', 'speed', 'sweet', 'special-defense', 'bitter');
