import * as Realm from "realm-web";

export const useRealmApp = () => {
	const appId = useRuntimeConfig().public.APP_ID;

	const app = new Realm.App(appId);

	let currentUser = app.currentUser;

	let mongo = null;
	if (app?.currentUser) {
		mongo = app.currentUser.mongoClient("mongodb-atlas");
	}

	const loginApiKey = async () => {
		const apiKey = useRuntimeConfig().public.USER_API_KEY;
		const credentials = Realm.Credentials.apiKey(apiKey);

		return await app.logIn(credentials);
	};

	async function logOut() {
		const globalStore = useGlobalStore();

		await currentUser.logOut();

		navigateTo("/");
		for (const storeName in globalStore) {
			if (globalStore[storeName]?.useStore) {
				const store = globalStore[storeName]?.useStore();
				if (store) store.$reset();
			}
		}
	}

	async function getRecords(dbName, colName, pipeline) {
		if (currentUser === null) {
			return null;
		}

		const mongo = currentUser.mongoClient("mongodb-atlas");
		const collection = mongo.db(dbName).collection(colName);

		if (!pipeline) {
			pipeline = [];
		}

		const result = await collection.aggregate(pipeline);

		return result;
	}

	async function getRecordsCount(dbName, colName, pipeline) {
		if (currentUser === null) {
			return null;
		}

		const result = await getRecords(dbName, colName, pipeline);

		return result;
	}

	async function addRecordToDB(dbName, colName, record) {
		if (currentUser === null) {
			return null;
		}

		const mongo = currentUser.mongoClient("mongodb-atlas");
		const collection = mongo.db(dbName).collection(colName);

		let result;

		await collection.insertOne(record).then((data) => {
			result = data;
		});

		return result;
	}

	async function updateRecordFromDB(dbName, colName, record) {
		if (currentUser === null) {
			return null;
		}

		if (!record) return null;

		const mongo = currentUser.mongoClient("mongodb-atlas");
		const collection = mongo.db(dbName).collection(colName);

		let result;

		result = await collection.updateOne({ _id: record._id }, record);

		return result;
	}

	async function updateRecordFromDB2(dbName, colName, id, set_data) {
		if (currentUser === null) {
			return null;
		}

		if (!set_data) return null;

		const mongo = currentUser.mongoClient("mongodb-atlas");
		const collection = mongo.db(dbName).collection(colName);

		let result;

		result = await collection.updateOne({ _id: id }, { $set: set_data });

		return result;
	}

	async function deleteRecordFromDB(dbName, colName, id) {
		if (currentUser === null) {
			return null;
		}

		const mongo = currentUser.mongoClient("mongodb-atlas");
		const collection = mongo.db(dbName).collection(colName);

		let result;

		await collection.deleteOne({ _id: id }).then((data) => {
			result = data;
		});

		return result;
	}

	async function deleteMultipleRecordsFromDB(dbName, colName, filter) {
		if (currentUser === null) {
			return null;
		}

		const mongo = currentUser.mongoClient("mongodb-atlas");
		const collection = mongo.db(dbName).collection(colName);

		let result;

		await collection.deleteMany(filter).then((data) => {
			result = data;
		});

		return result;
	}

	async function updateMultipleRecordsFromDB(
		dbName,
		colName,
		filter,
		set_data
	) {
		if (currentUser === null) {
			return null;
		}

		const mongo = currentUser.mongoClient("mongodb-atlas");
		const collection = mongo.db(dbName).collection(colName);

		let result;

		let data = { $set: set_data.data };

		if (set_data.history) {
			data.$push = set_data.history;
		}

		await collection.updateMany(filter, data).then((data) => {
			result = data;
		});

		return result;
	}

	async function findRecordFromDB(dbName, colName, field, value) {
		if (currentUser === null) {
			return null;
		}

		const mongo = currentUser.mongoClient("mongodb-atlas");
		const collection = mongo.db(dbName).collection(colName);

		let result,
			obj = {};

		obj[field] = value;

		await collection.findOne(obj).then((data) => {
			result = data;
		});

		return result;
	}

	return {
		app,
		Realm,
		mongo,
		currentUser,
		loginApiKey,
		logOut,
		getRecords,
		getRecordsCount,
		addRecordToDB,
		updateRecordFromDB,
		updateRecordFromDB2,
		deleteRecordFromDB,
		deleteMultipleRecordsFromDB,
		updateMultipleRecordsFromDB,
		findRecordFromDB,
	};
};
