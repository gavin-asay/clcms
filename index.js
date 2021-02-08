const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
const addNewRole = require('./utils/addNewRole');

const connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: 'aaNHv8Z6WnY%o*X',
	database: 'clcms',
});

function getQueryData(sql, params = []) {
	return new Promise(function (resolve, reject) {
		connection.query(sql, params, function (err, res) {
			if (err) {
				reject(err);
				return;
			}

			if (res.length === 0) {
				reject('No data found.');
				console.log('No data found.');
				return;
			}

			resolve(res);
		});
	});
}

function showUpdatedTable(table) {
	const sql = `SELECT * FROM ${table}`;
	connection.query(sql, function (err, res) {
		if (err) throw err;
		console.table(res);
	});
}

function mainMenu() {
	const options = [
		'View all departments',
		'View all roles',
		'View all employees',
		'Add a department',
		'Add a role',
		'Add an employee',
		'Update an employee role',
	];

	inquirer
		.prompt([
			{
				type: 'list',
				name: 'main',
				message: 'Select an option.',
				choices: options,
				filter: input => options.indexOf(input),
			},
		])
		.then(ans => {
			const { main } = ans;
			const tables = ['departments', 'roles', 'employees'];

			if (main === 0) {
				const sql = `SELECT * FROM departments`;

				getQueryData(sql).then(res => console.table(res));
			} else if (main === 1) {
				const sql = `SELECT roles.id, roles.title, roles.salary, departments.name AS department FROM roles
				JOIN departments ON roles.department_id = departments.id`;

				getQueryData(sql).then(res => {
					console.table(res);
					mainMenu();
				});
			} else if (main === 2) {
				const sql = `SELECT e.id, e.last_name, e.first_name, r.title AS role, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employees e LEFT JOIN employees m ON m.id = e.manager_id LEFT JOIN roles r ON e.role_id = r.id`;

				getQueryData(sql).then(res => {
					console.table(res);
					mainMenu();
				});
			} else if (main === 3) {
				inquirer
					.prompt([
						{
							type: 'input',
							name: 'userText',
							message: 'Enter the name of the new department.',
							validate: input => {
								if (input) return true;
								console.log('Please enter a name.');
								return false;
							},
						},
					])
					.then(ans => {
						const { userText } = ans;
						const sql = `INSERT INTO departments (name) VALUES ('${userText}')`;

						getQueryData(sql).then(res => {
							if (res.affectedRows > 0)
								console.log(`Department ${userText} added successfully!`);
						});
					});
			} else if (main === 4) {
				const sql = `SELECT name, id FROM departments`;
				getQueryData(sql)
					.then(res => addNewRole(res))
					.then(ans => {
						const { title, salary, dept } = ans;
						const sql = `INSERT INTO roles (title, salary, department_id) VALUES ('${title}', '${salary}', '${dept}')`;
						getQueryData(sql).then(res => {
							if (res.affectedRows > 0) console.log('Role added successfully!');
						});
					});
			} else if (main === 5) {
				let managers;
				let roles;

				const sql0 = `SELECT * FROM roles`;
				const sql1 = `SELECT CONCAT(employees.first_name, ' ', employees.last_name) AS name FROM employees`;

				getQueryData(sql0).then(res => {
					roles = res.map(row => row.title);
					getQueryData(sql1).then(res => {
						managers = res.map(row => row.name);
						managers.unshift('None');
						inquirer
							.prompt([
								{
									type: 'input',
									name: 'first_name',
									message: "Enter the employee's first name.",
									validate: input => {
										if (typeof input === 'string' && input.length > 0)
											return true;
										return false;
									},
								},
								{
									type: 'input',
									name: 'last_name',
									message: "Enter the employee's last name.",
									validate: input => {
										if (typeof input === 'string' && input.length > 0)
											return true;
										return false;
									},
								},
								{
									type: 'list',
									name: 'role',
									choices: roles,
									message: "Select the employee's role.",
									filter: input => roles.indexOf(input) + 1,
								},
								{
									type: 'list',
									name: 'manager',
									choices: managers,
									message: "Select the employee's manager.",
									filter: input => {
										if (input === 'None') return null;
										return managers.indexOf(input);
									},
								},
							])
							.then(ans => {
								const { first_name, last_name, role, manager } = ans;

								const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
								const params = [first_name, last_name, role, manager];

								getQueryData(sql, params).then(res => {
									if (res.affectedRows > 0)
										console.log('Role added successfully!');
								});
							});
					});
				});
			}
		})
		.catch(err => {
			console.log(err);
			connection.end();
		});
}

mainMenu();
