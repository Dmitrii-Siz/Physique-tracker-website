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

--SQL for the progress table:
CREATE TABLE progress (
    progress_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    date_uploaded VARCHAR(100) NOT NULL,
    path_to VARCHAR(1000) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);


--Testing SQL for the progress table:
INSERT INTO progress (user_id, date_uploaded, path_to)
VALUES (1, '2023-11-21', '123123132test_img_1.jpg');
INSERT INTO progress (user_id, date_uploaded, path_to)
VALUES (1, '2023-11-28', '12312321test_img_2.jpg');
INSERT INTO progress (user_id, date_uploaded, path_to)
VALUES (1, '2023-12-5', '90412474test_img_3.jpg');
INSERT INTO progress (user_id, date_uploaded, path_to)
VALUES (1, '2023-12-12', '1702402268734_31231321test_img_4.jpg');
