function addDepartment() {
	return inquirer.prompt([
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
	]);
}

module.exports = addDepartment;
