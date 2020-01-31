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

INSERT INTO department (id, name) VALUES (1, 'Human Resources'), (2, 'Engineering'), (3, 'Legal');
INSERT INTO role (id, title, salary, department_id) VALUES 
	(1, 'Software Developer', 75000.00, 2), 
    (2, 'Senior Software Developer', 95000.00, 2),
    (3, 'Hiring Personnel', 55000.00, 1),
    (4, 'Entry Liability Counsel', 90000.00, 3),
    (5, 'General Counsel', 150000.00, 3);
    
INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES
	(1, 'Anthony', 'Garza', 2, NULL),
    (2, 'Crystal', 'Ly', 1, 1), 
    (3, 'Anathema', 'Smith', 5, NULL),
    (4, 'Kim', 'Ruiz', 3, NULL),
    (5, 'Jeff', 'Blaze', 4, 3);
