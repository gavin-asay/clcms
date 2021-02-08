const inquirer = require('inquirer');

function addEmployee(res, roles) {
	managers = res.map(row => row.name);
	managers.unshift('None');
	return inquirer.prompt([
		{
			type: 'input',
			name: 'first_name',
			message: "Enter the employee's first name.",
			validate: input => {
				if (typeof input === 'string' && input.length > 0) return true;
				return false;
			},
		},
		{
			type: 'input',
			name: 'last_name',
			message: "Enter the employee's last name.",
			validate: input => {
				if (typeof input === 'string' && input.length > 0) return true;
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
	]);
}

module.exports = addEmployee;
