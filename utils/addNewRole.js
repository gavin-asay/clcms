const inquirer = require('inquirer');
const mysql = require('mysql2');

function addNewRole(res) {
	const departments = res.map(row => row.name);

	return inquirer.prompt([
		{
			type: 'input',
			name: 'title',
			message: 'Enter the title of the new role.',
			validate: input => {
				if (input) return true;
				console.log('Please enter a title.');
				return false;
			},
		},
		{
			type: 'input',
			name: 'salary',
			message: 'Enter the salary of the new role.',
			validate: input => {
				if (!isNaN(parseInt(input))) return true;
				console.log('Please enter a number.');
				return false;
			},
			filter: input => parseInt(input),
		},
		{
			type: 'list',
			name: 'dept',
			message: 'Select a department for the new role.',
			choices: departments,
			filter: input => departments.indexOf(input) + 1,
		},
	]);
}

module.exports = addNewRole;
