const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
const addNewRole = require('./utils/addNewRole');
const addDepartment = require('./utils/addDepartment');
const addEmployee = require('./utils/addEmployee');

const connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: '',
	database: 'clcms',
});

// packaging query results in a promise helped me enforce proper sequence of code segments
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

function mainMenu() {
	const options = [
		'View all departments',
		'View all roles',
		'View all employees',
		'Add a department',
		'Add a role',
		'Add an employee',
		'Update an employee role',
		'Exit program',
	];

	inquirer
		.prompt([
			{
				type: 'list',
				name: 'main',
				message: 'Welcome to CLCMS! Select an option.',
				choices: options,
				filter: input => options.indexOf(input), // changes the answer for this question to the index of the selected option (see array above)
			},
		])
		.then(ans => {
			const { main } = ans;

			if (main === 0) {
				const sql = `SELECT * FROM departments`;

				getQueryData(sql).then(res => {
					console.log('\n\n');
					console.table(res);
					setTimeout(mainMenu, 2000);
				});
			} else if (main === 1) {
				const sql = `SELECT roles.id, roles.title, roles.salary, departments.name AS department FROM roles
				JOIN departments ON roles.department_id = departments.id`;

				getQueryData(sql).then(res => {
					console.log('\n\n');
					console.table(res);
					setTimeout(mainMenu, 2000);
				});
			} else if (main === 2) {
				const sql = `SELECT e.id, e.last_name, e.first_name, r.title AS role, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employees e LEFT JOIN employees m ON m.id = e.manager_id LEFT JOIN roles r ON e.role_id = r.id`;

				getQueryData(sql).then(res => {
					console.log('\n\n');
					console.table(res);
					setTimeout(mainMenu, 2000);
				});
			} else if (main === 3) {
				addDepartment().then(ans => {
					// see ./utils/addDepartment
					const { userText } = ans;
					const sql = `INSERT INTO departments (name) VALUES ('${userText}')`;

					getQueryData(sql).then(res => {
						if (res.affectedRows > 0)
							console.log(`Department ${userText} added successfully!`);
						setTimeout(mainMenu, 1000);
					});
				});
			} else if (main === 4) {
				const sql = `SELECT name, id FROM departments`;
				getQueryData(sql)
					.then(res => addNewRole(res)) // see ./utils/addNewRole
					.then(ans => {
						const { title, salary, dept } = ans;
						const sql = `INSERT INTO roles (title, salary, department_id) VALUES ('${title}', '${salary}', '${dept}')`;
						getQueryData(sql).then(res => {
							if (res.affectedRows > 0) console.log('Role added successfully!');
							setTimeout(mainMenu, 1000);
						});
					});
				return true;
			} else if (main === 5) {
				let managers;
				let roles;

				const sql0 = `SELECT * FROM roles`;
				const sql1 = `SELECT CONCAT(employees.first_name, ' ', employees.last_name) AS name FROM employees`;

				getQueryData(sql0)
					.then(res => {
						roles = res.map(row => row.title);
						return getQueryData(sql1);
					})
					.then(res => addEmployee(res, roles)) // see ./utils/addEmployee
					.then(ans => {
						const { first_name, last_name, role, manager } = ans;

						const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
						const params = [first_name, last_name, role, manager];

						getQueryData(sql, params).then(res => {
							if (res.affectedRows > 0) console.log('Role added successfully!');
							setTimeout(mainMenu, 1000);
						});
					});
				return true;
			} else if (main === 6) {
				let employee;
				const sql0 = `SELECT CONCAT(employees.first_name, ' ', employees.last_name) AS name FROM employees`;
				getQueryData(sql0)
					.then(res => {
						const employees = res.map(row => row.name);

						return inquirer.prompt([
							{
								type: 'list',
								name: 'employee',
								message: 'Select an employee to update.',
								choices: employees,
								filter: input => [input, employees.indexOf(input) + 1],
							},
						]);
					})
					.then(ans => {
						employee = ans.employee;
						const sql1 = `SELECT title FROM roles`;
						return getQueryData(sql1);
					})
					.then(res => {
						console.log(res);
						const roles = res.map(row => row.title);

						return inquirer.prompt([
							{
								type: 'list',
								name: 'newRole',
								messages: `Select a new role for ${employee[0]}.`,
								choices: roles,
								filter: input => roles.indexOf(input) + 1,
							},
						]);
					})
					.then(ans => {
						const sql2 = `UPDATE employees SET role_id = ? WHERE id = ?`;
						const params = [ans.newRole, employee[1]];

						return getQueryData(sql2, params);
					})
					.then(res => {
						if (res.affectedRows > 0) console.log('Role added successfully!');
						setTimeout(mainMenu, 1000);
					});
			} else if (main === 7) {
				console.log('Goodbye.');
				connection.end();
			}
		})
		.catch(err => {
			console.log(err);
		});
}

mainMenu();
