const fs = require('fs').promises;
const readline = require('readline');
const inflection = require('inflection');

// Function to prompt user for input
function prompt(question) {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	return new Promise((resolve) => {
		rl.question(question, (answer) => {
			rl.close();
			resolve(answer);
		});
	});
}

async function removeFiles() {
	try {
		const tableName = await prompt('Enter the table name: ');

		const toLowerSingular = inflection.singularize(tableName).toLowerCase();
		const toLowerPlural = inflection.pluralize(tableName).toLowerCase();
		const toCapitalizedSingular = inflection.capitalize(toLowerSingular);

		// File removal
		await fs.unlink(`pages/${toLowerPlural}.vue`);
		await fs.unlink(`stores/${toLowerSingular}.js`);
		await fs.unlink(`composables/${toLowerSingular}.js`);
		await fs.unlink(`components/SideDrawer/${toCapitalizedSingular}.vue`);
		await fs.unlink(`table_configs/${toLowerSingular}.json`);

		console.log(`A table named '${tableName}' has been deleted.`);
	} catch (err) {
		console.error(`Error removing table:`, err.message);
	}
}

removeFiles();
