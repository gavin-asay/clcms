DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS employees;

CREATE TABLE departments (
    id INTEGER UNSIGNED AUTO_INCREMENT,
    name VARCHAR(30),
    PRIMARY KEY(id)
);

CREATE TABLE roles (
    id INTEGER UNSIGNED AUTO_INCREMENT,
    title VARCHAR(50),
    salary DECIMAL UNSIGNED,
    department_id INTEGER UNSIGNED,
    PRIMARY KEY(id),
    FOREIGN KEY(department_id) REFERENCES departments(id) ON DELETE SET NULL
);

CREATE TABLE employees (
    id INTEGER UNSIGNED AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INTEGER UNSIGNED,
    manager_id INTEGER UNSIGNED,
    PRIMARY KEY(id),
    FOREIGN KEY(role_id) REFERENCES roles(id) ON DELETE SET NULL,
    FOREIGN KEY(manager_id) REFERENCES employees(id) ON DELETE SET NULL
);