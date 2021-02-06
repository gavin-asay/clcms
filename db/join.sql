SELECT employees.first_name, employees.last_name, roles.title FROM employees
JOIN roles ON employees.role_id = roles.id;