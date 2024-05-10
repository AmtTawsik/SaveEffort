export default async (field, colName) => {
	const { uniqueValuesStore } = useGlobalStore();
	const store = uniqueValuesStore.useStore();

	let res = null;

	const nestedFields = field.split(".");

	await store.initRecordsData().then((record) => {
		if (record) {
			res = findNestedPropertyValue(record, colName, nestedFields);
		}
	});

	return res;
};

const findNestedPropertyValue = (record, colName, nestedFields) => {
	let res = null;

	for (const data of record) {
		if (data.collection === colName) {
			res = data;

			for (const nestedField of nestedFields) {
				if (res && res.hasOwnProperty(nestedField)) {
					res = res[nestedField];
				} else {
					res = null;
					break;
				}
			}

			if (res !== null) {
				break;
			}
		}
	}

	return res;
};
