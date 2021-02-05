INSERT INTO departments (name)
VALUES
('Accounting'),
('IT'),
('Development'),
('Marketing'),
('Sales');

INSERT INTO roles (title, salary, department_id)
VALUES
('Tax Manager', 120000, 1),
('Senior Accountant', 80000, 1),
('Junior Accountant', 65000, 1),
('Sysadmin', 70000, 2),
('Helpdesk', 55000, 2),
('Project Manager', 130000, 3),
('Scrum Master', 125000, 3),
('Senior Developer', 120000, 3),
('Junior Developer', 100000, 3),
('Chief Marketing Officer', 150000, 4),
('Marketing Manager', 90000, 4),
('Social Media Specialist', 72000, 4),
('Copywriter', 48000, 4),
('Chief Sales Officer', 300000, 5),
('Regional Manager', 200000, 5),
('Assistant to the Regional Manager', 80000, 5),
('Customer Service Representative', 32000, 5);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
('Jim', 'Asay', 1, NULL),
('Bob', 'Vance', 2, 1),
('Kevin', 'Smith', 3, 1),
('Napoleon', 'Dynamite', 4, NULL),
('Captain', 'Obvious', 5, 4),
('Peter', 'Pan', 6, NULL),
('Bald', 'Programmer', 7, NULL),
('Jaku', 'Oldman', 8, NULL),
('Princess', 'Peach', 9, NULL),
('Elend', 'Venture', 10, NULL),
('Vin', 'Venture', 11, NULL),
('Diane', 'Nguyen', 12, NULL),
('Albert', 'Einstein', 13, NULL),
('King', 'Barbarian', 14, NULL),
('Michael', 'Scott', 15, NULL),
('Dwight', 'Schrute', 16, NULL),
('Amy', 'Poehler', 17, NULL);