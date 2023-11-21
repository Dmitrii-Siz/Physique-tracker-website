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
    hashedPassword VARCHAR(128) NOT NULL
);

-- SQL code to create the food's table:
CREATE TABLE foods (
    food_id INT AUTO_INCREMENT PRIMARY KEY,
    food_name VARCHAR(100) NOT NULL,
    calories INT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

Create TABLE progress(
    date_uploaded VARCHAR(100) NOT NULL,
    path_to VARCHAR(100) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);