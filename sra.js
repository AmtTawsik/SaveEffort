const fs = require('fs');
const readline = require('readline');
const inflection = require('inflection');

// Function to perform string replacement in a file
function replaceStringInFile(filePath, searchString, replaceString) {
	let fileContent = fs.readFileSync(filePath, 'utf8');
	fileContent = fileContent.replace(
		new RegExp(searchString, 'g'),
		replaceString
	);
	fs.writeFileSync(filePath, fileContent, 'utf8');
}

// Function to copy a file
function copyFile(sourcePath, destinationPath) {
	fs.copyFileSync(sourcePath, destinationPath);
}

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

async function main() {
	try {
		// User input
		const tableName = await prompt('Enter the table name: ');

		const toLowerSingular = inflection.singularize(tableName).toLowerCase();
		const toLowerPlural = inflection.pluralize(tableName).toLowerCase();

		const toCapitalizedSingular = inflection.capitalize(toLowerSingular);
		const toCapitalizedPlural = inflection.capitalize(toLowerPlural);

		// Copy From
		const fromLowerSingular = 'contact';
		const fromLowerPlural = 'contacts';

		const fromCapitalizedSingular = 'Contact';
		const fromCapitalizedPlural = 'Contacts';

		// Check if the target files already exist
		const targetFiles = [
			`pages/${toLowerPlural}.vue`,
			`stores/${toLowerSingular}.js`,
			`composables/${toLowerSingular}.js`,
			`components/SideDrawer/${toCapitalizedSingular}.vue`,
			`table_configs/${toLowerSingular}.json`,
		];

		const existingFiles = targetFiles.filter((file) => fs.existsSync(file));

		if (existingFiles.length > 0) {
			console.log(`A table named '${tableName}' already exists.`);
			return; // Exit the script
		}

		// Copy files
		copyFile(`pages/${fromLowerPlural}.vue`, `pages/${toLowerPlural}.vue`);
		copyFile(`stores/${fromLowerSingular}.js`, `stores/${toLowerSingular}.js`);
		copyFile(
			`composables/${fromLowerSingular}.js`,
			`composables/${toLowerSingular}.js`
		);
		copyFile(
			`components/SideDrawer/Default.vue`,
			`components/SideDrawer/${toCapitalizedSingular}.vue`
		);
		copyFile(
			`table_configs/${fromLowerSingular}.json`,
			`table_configs/${toLowerSingular}.json`
		);

		// Replace strings
		replaceStringInFile(
			`pages/${toLowerPlural}.vue`,
			fromCapitalizedPlural,
			toCapitalizedPlural
		);

		replaceStringInFile(
			`pages/${toLowerPlural}.vue`,
			fromLowerPlural,
			toLowerPlural
		);

		replaceStringInFile(
			`pages/${toLowerPlural}.vue`,
			fromCapitalizedSingular,
			toCapitalizedSingular
		);

		replaceStringInFile(
			`pages/${toLowerPlural}.vue`,
			fromLowerSingular,
			toLowerSingular
		);

		replaceStringInFile(
			`stores/${toLowerSingular}.js`,
			fromLowerPlural,
			toLowerPlural
		);

		replaceStringInFile(
			`stores/${toLowerSingular}.js`,
			fromCapitalizedPlural,
			toCapitalizedPlural
		);

		replaceStringInFile(
			`stores/${toLowerSingular}.js`,
			fromCapitalizedSingular,
			toCapitalizedSingular
		);

		replaceStringInFile(
			`stores/${toLowerSingular}.js`,
			fromLowerSingular,
			toLowerSingular
		);

		replaceStringInFile(
			`composables/${toLowerSingular}.js`,
			fromCapitalizedPlural,
			toCapitalizedPlural
		);

		replaceStringInFile(
			`composables/${toLowerSingular}.js`,
			fromLowerPlural,
			toLowerPlural
		);

		replaceStringInFile(
			`composables/${toLowerSingular}.js`,
			fromCapitalizedSingular,
			toCapitalizedSingular
		);

		replaceStringInFile(
			`composables/${toLowerSingular}.js`,
			fromLowerSingular,
			toLowerSingular
		);

		console.log(`A table named '${tableName}' has been created.`);
	} catch (err) {
		console.error(`Error creating table':`, err.message);
	}
}

main();
