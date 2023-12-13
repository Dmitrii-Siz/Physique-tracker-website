CREATE DATABASE physique_tracker;
USE use physique_tracker;
CREATE USER 'appuser'@'localhost' IDENTIFIED WITH mysql_native_password BY 'app2027';
GRANT ALL PRIVILEGES ON physique_tracker.* TO 'appuser'@'localhost';

-- SQL code to create the user's table:
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    hashedPassword VARCHAR(128) NOT NULL,
    keyId VARCHAR(255) NOT NULL UNIQUE
);

--SQL for the progress table:
CREATE TABLE progress (
    progress_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    date_uploaded VARCHAR(100) NOT NULL,
    path_to VARCHAR(1000) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

Create table motivation (
    name VARCHAR(100),
    surname VARCHAR(100),
    gender VARCHAR(50)
);

--Adding values to the motivation table:
INSERT INTO motivation (name, surname, gender) VALUES 
('Arnold', 'Schwarzenegger', 'Male'),
('Ronnie', 'Coleman', 'Male'),
('Dorian', 'Yates', 'Male'),
('Lee', 'Haney', 'Male'),
('Flex', 'Wheeler', 'Male'),
('Phil', 'Heath', 'Male'),
('Jay', 'Cutler', 'Male'),
('Frank', 'Zane', 'Male'),
('Sergio', 'Oliva', 'Male'),
('Shawn', 'Ray', 'Male'),
('Rich', 'Gaspari', 'Male'),
('Kevin', 'Levrone', 'Male'),
('Dexter', 'Jackson', 'Male'),
('Lee', 'Priest', 'Male'),
('Markus', 'Rühl', 'Male'),
('Roelly', 'Winklaar', 'Male'),
('Reg', 'Park', 'Male'),
('Steve', 'Reeves', 'Male'),
('Lou', 'Ferrigno', 'Male'),
('Larry', 'Scott', 'Male'),
('Kai', 'Greene', 'Male'),
('Bob', 'Paris', 'Male'),
('Tom', 'Platz', 'Male'),
('Chris', 'Cormier', 'Male'),
('Vince', 'Taylor', 'Male'),
('Paul', 'Dillett', 'Male'),
('Nasser', 'El Sonbaty', 'Male'),
('Samir', 'Bannout', 'Male'),
('Shawn', 'Rhoden', 'Male'),
('Cedric', 'McMillan', 'Male'),
('Dennis', 'Wolf', 'Male'),
('Branch', 'Warren', 'Male'),
('Gustavo', 'Badell', 'Male'),
('Andreas', 'Munzer', 'Male'),
('Johnny', 'Jackson', 'Male'),
('Johnnie', 'O. Jackson', 'Male'),
('Roelly', 'Winklaar', 'Male'),
('William', 'Bonac', 'Male'),
('Regan', 'Grimes', 'Male'),
('Hadi', 'Choopan', 'Male'),
('Shawn', 'Flexatron Rhoden', 'Male'),
('Chris', 'Bumstead', 'Male'),
('Breon', 'Ansley', 'Male'),
('Sergio', 'Oliva Jr.', 'Male'),
('Nathan', 'De Asha', 'Male'),
('Josh', 'Lenartowicz', 'Male'),
('James', 'Hollingshead', 'Male'),
('Justin', 'Rodriguez', 'Male'),
('Rafael', 'Brandao', 'Male'),
('Flex', 'Lewis', 'Male');

-- inserting female body builders
INSERT INTO motivation (name, surname, gender) VALUES 
('Iris', 'Kyle', 'Female'),
('Lenda', 'Murray', 'Female'),
('Cory', 'Everson', 'Female'),
('Nicole', 'Wilkins', 'Female'),
('Linda', 'Murray', 'Female'),
('Juliana', 'Malacarne', 'Female'),
('Yaxeni', 'Oriquen-Garcia', 'Female'),
('Debi', 'Laszewski', 'Female'),
('Alina', 'Popa', 'Female'),
('Oksana', 'Grishina', 'Female'),
('Andrea', 'Shaw', 'Female'),
('Margie', 'Martin', 'Female'),
('Helle', 'Trevino', 'Female'),
('Monique', 'Jones', 'Female'),
('Natalia', 'Coelho', 'Female'),
('Irene', 'Andersen', 'Female'),
('Kim', 'Chizevsky', 'Female'),
('Sheila', 'Bleck', 'Female'),
('Dayana', 'Cadeau', 'Female'),
('Heather', 'Foster', 'Female'),
('Brigita', 'Brezovac', 'Female'),
('Laura', 'Bass', 'Female'),
('Anne', 'Freitas', 'Female'),
('Colette', 'Nelson', 'Female'),
('Tonya', 'Knight', 'Female'),
('Lisa', 'Aukland', 'Female'),
('Sue', 'Scheppele', 'Female'),
('Vickie', 'Gates', 'Female'),
('Betty', 'Pariso', 'Female'),
('Tina', 'Chandler', 'Female'),
('Shannon', 'Courtney', 'Female'),
('Theresa', 'Ivancik', 'Female'),
('Sarah', 'Hayes', 'Female'),
('Christine', 'Roth', 'Female'),
('Sharon', 'Bruneau', 'Female'),
('Lauren', 'Rutan', 'Female'),
('Susie', 'Curry', 'Female'),
('Carla', 'Dunlap', 'Female'),
('Cathy', 'LeFrancois', 'Female'),
('Donna', 'Oliveira', 'Female'),
('Debby', 'Mack', 'Female'),
('Nikki', 'Fuller', 'Female'),
('Paula', 'Bircumshaw', 'Female'),
('Claire', 'O''Connell', 'Female'),
('Jenny', 'Worth', 'Female'),
('Gladys', 'Portugues', 'Female'),
('Beverly', 'DiRenzo', 'Female'),
('Anja', 'Langer', 'Female'),
('Klaudia', 'Larson', 'Female'),
('Nancy', 'Lewis', 'Female');



--Testing SQL for the progress table:
INSERT INTO progress (user_id, date_uploaded, path_to)
VALUES (1, '2023-11-21', '123123132test_img_1.jpg');
INSERT INTO progress (user_id, date_uploaded, path_to)
VALUES (1, '2023-11-28', '12312321test_img_2.jpg');
INSERT INTO progress (user_id, date_uploaded, path_to)
VALUES (1, '2023-12-5', '90412474test_img_3.jpg');
INSERT INTO progress (user_id, date_uploaded, path_to)
VALUES (1, '2023-12-12', '1702402268734_31231321test_img_4.jpg');
