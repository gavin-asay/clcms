const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

const connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: 'aaNHv8Z6WnY%o*X',
	database: 'clcms',
});

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
				choices: options,
				filter: function (input) {
					return options.indexOf(input);
				},
			},
		])
		.then(ans => {
			const departments = 'departments';
			// console.log(ans);
			const tables = [departments, 'roles', 'employees'];
			const sql = 'SELECT * FROM ?';
			const params = [tables[ans.main]];
			switch (ans.main) {
				case 0:
				case 1:
				case 2:
					connection.query(sql, params, function (err, result) {
						console.log(this.sql);
						if (err) throw err;
						console.table(result);
					});
					break;
			}

			connection.end();
		});
}

mainMenu();
