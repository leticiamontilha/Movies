CREATE DATABASE m4_entrega_movies;

CREATE TABLE if NOT EXISTS movies (
	id SERIAL PRIMARY KEY,
	name VARCHAR(50) NOT NULL,
	description TEXT,
	duration INTEGER NOT NULL,
	price INTEGER NOT NULL
);

INSERT INTO 
	movies(name, description, duration, price)
VALUES
('Titanic', 'Filme romantico e naufragio de navio', 120, 10);

SELECT  
*
FROM  
movies;

SELECT  
*    
FROM
movies
 WHERE
name = 'Titanic';


UPDATE movies SET
name = 'filme',
description = 'drama',
duration = '100',
price = '5'
WHERE 
id = 3;


DELETE FROM movies 
WHERE 
id = 3;