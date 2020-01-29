create database seed;

use seed;

CREATE TABLE department (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30)
);

CREATE TABLE role (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL(10,2),
    department_id INT UNSIGNED,
    FOREIGN KEY (department_id)
        REFERENCES department(id)
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

CREATE TABLE employee (
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT UNSIGNED,
    manager_id INT UNSIGNED,
    FOREIGN KEY (role_id)
        REFERENCES role(id)
        ON UPDATE NO ACTION
        ON DELETE SET NULL,
	FOREIGN KEY (manager_id)
        REFERENCES employee(id)
        ON UPDATE NO ACTION
        ON DELETE SET NULL
);