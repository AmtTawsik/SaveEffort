import { BSON } from "realm-web";

export const useStores = () => {
	const toast = useNuxtApp().$toast;

	const {
		getRecords,
		getRecordsCount,
		findRecordFromDB,
		addRecordToDB,
		updateRecordFromDB,
		updateMultipleRecordsFromDB,
		updateRecordFromDB2,
		deleteRecordFromDB,
		deleteMultipleRecordsFromDB,
	} = useRealmApp();

	function __calculateNoOfPages(context) {
		context.totalPages = Math.ceil(
			context.recordsDataLength / context.pageStep
		);
		if (context.currentPage > context.totalPages) {
			context.currentPage = context.totalPages;
		}
	}

	async function __assignCallback(header, assign_to_id, globalStore) {
		try {
			let store;
			if (globalStore[header.get_from]) {
				store = globalStore[header.get_from].useStore();
				const record = await store.findById(header.assigned_value);
				if (record && record[header.assign_to_field]) {
					record[header.assign_to_field].push(assign_to_id);
				} else if (record && !record[header.assign_to_field]) {
					record[header.assign_to_field] = [assign_to_id];
				}
				store.updateRecord(record);
			}
		} catch (err) {
			console.error(err);
		}
	}

	async function __setRecordsCount(context, pipeline) {
		try {
			if (!pipeline) {
				pipeline = [];
			}

			pipeline.push({ $count: "total" });

			const result = await getRecordsCount(
				context.dbName,
				context.colName,
				pipeline
			);

			if (result && result.length > 0) {
				context.recordsDataBackupLength = context.recordsDataLength =
					result[0].total;
				context.calculateNoOfPages();
			} else {
				context.recordsDataBackupLength = context.recordsDataLength = 0;
				context.totalPages = context.currentPage = 1;
			}
		} catch (err) {
			console.error(err);
		}
	}

	async function __fetchData(context, match, sort) {
		context.isFetching = true;
		try {
			let pipeline = [];

			if (match?.length > 0) {
				pipeline.push({ $match: { $and: match } });
				await context.setRecordsCount(pipeline);
				pipeline.pop();
			} else {
				await context.setRecordsCount(pipeline);
				pipeline.pop();
			}

			if (sort) pipeline.push({ $sort: sort });

			const skip = (context.currentPage - 1) * context.pageStep;

			pipeline.push({ $skip: skip });
			pipeline.push({ $limit: context.pageStep });

			context.recordsDataBackup = context.recordsData = await getRecords(
				context.dbName,
				context.colName,
				pipeline
			);
		} catch (err) {
			console.error(err);
		} finally {
			context.isFetching = false;
		}
	}

	async function __findRecords(context, match) {
		try {
			let pipeline = [];
			if (match?.length > 0) {
				pipeline.push({ $match: { $and: match } });
			}

			return await getRecords(context.dbName, context.colName, pipeline);
		} catch (err) {
			console.error(err);
		}
	}

	async function __addRecord(context, data, assign_headers, globalStore) {
		try {
			const { insertedId } = await addRecordToDB(
				context.dbName,
				context.colName,
				data
			);
			data._id = insertedId;
			context.recordsData.push(data);
			context.recordsDataBackup = context.recordsData;
			context.selectedRecords = [];
			context.recordsDataBackupLength = context.recordsDataLength =
				context.recordsDataLength + 1;

			if (assign_headers && assign_headers.length > 0) {
				assign_headers.forEach((header) =>
					context.assignCallback(header, insertedId, globalStore)
				);
			}
			toast.success("Record added successfully");

			return insertedId;
		} catch (err) {
			console.error(err);
			toast.error(err.error);
		} finally {
			context.isAdding = false;
		}
	}

	async function __updateRecord(context, data) {
		try {
			const res = await updateRecordFromDB(
				context.dbName,
				context.colName,
				data
			);

			const index = context.recordsData.findIndex(
				(element) => data._id.toString() === element._id.toString()
			);

			context.recordsData[index] = data;
			context.recordsDataBackup = context.recordsData;
			context.selectedRecords = [];

			return res;
		} catch (err) {
			console.error(err);
			toast.error(err.error);
		}
	}

	async function __updateRecordsMany(context, set_data, saveView) {
		try {
			const filter = { _id: { $in: context.selectedRecords } };
			context.isFetching = true;

			const res = await updateMultipleRecordsFromDB(
				context.dbName,
				context.colName,
				filter,
				set_data
			);

			const matchToUse = saveView.match || context.defaultMatch;
			const sortToUse = saveView.sort || context.defaultSort;

			context.fetchData(matchToUse, sortToUse);

			context.selectedRecords = [];

			return res;
		} catch (err) {
			console.error(err);
			toast.error(err.error);
		}
	}

	async function __findByField(context, field, value) {
		try {
			let res = null;

			if (!field || !value) return null;
			if (context.recordsData) {
				res = context.recordsData.find((item) => item.field === value);
				if (res) return res;
				else
					return await findRecordFromDB(
						context.dbName,
						context.colName,
						field,
						value
					);
			} else {
				return await findRecordFromDB(
					context.dbName,
					context.colName,
					field,
					value
				);
			}
		} catch (err) {
			console.error(err);
		}
	}

	async function __addField(context, set_data, record, assign_headers) {
		const globalStore = useGlobalStore();

		try {
			const res = await updateRecordFromDB2(
				context.dbName,
				context.colName,
				record._id,
				set_data
			);

			const index = context.recordsData.findIndex(
				(element) => record._id.toString() === element._id.toString()
			);

			if (index < 0) return;

			for (const key in set_data) {
				context.recordsData[index][key] = set_data[key];
			}

			context.recordsDataBackup = context.recordsData;
			context.selectedRecords = [];

			if (assign_headers?.length > 0) {
				assign_headers.forEach((header) =>
					context.assignCallback(header, record._id, globalStore)
				);
			}

			return res;
		} catch (err) {
			console.error(err);
			toast.error(err.error);
		}
	}

	async function __findById(context, id) {
		try {
			let res = null;

			if (!id) return null;
			if (typeof id == "string") {
				id = BSON.ObjectID(id);
			}
			if (context.recordsData) {
				res = context.recordsData.find(
					(item) => item._id.toString() === id.toString()
				);
				if (res) return res;
				else
					return await findRecordFromDB(
						context.dbName,
						context.colName,
						"_id",
						id
					);
			} else {
				return await findRecordFromDB(
					context.dbName,
					context.colName,
					"_id",
					id
				);
			}
		} catch (err) {
			console.error(err);
		}
	}

	async function __initRecordsData(context, match, sort) {
		try {
			if (context.recordsData === null) {
				context.defaultMatch = match;
				context.defaultSort = sort;
				await context.fetchData(match, sort);
				return context.recordsData;
			} else return context.recordsData;
		} catch (err) {
			console.error(err);
		}
	}

	async function __deleteRecord(context, _id, saveView) {
		try {
			if (_id) {
				context.isFetching = true;
				const res = await deleteRecordFromDB(
					context.dbName,
					context.colName,
					_id
				);
				context.fetchData(context.defaultMatch, context.defaultSort);
				toast.success("Record deleted successfully");

				return res;
			} else {
				const filter = { _id: { $in: context.selectedRecords } };
				context.isFetching = true;
				const res = await deleteMultipleRecordsFromDB(
					context.dbName,
					context.colName,
					filter
				);

				const matchToUse = saveView.match || context.defaultMatch;
				const sortToUse = saveView.sort || context.defaultSort;

				context.fetchData(matchToUse, sortToUse);
				context.selectedRecords = [];
				toast.success("Records deleted successfully");

				return res;
			}
		} catch (err) {
			console.error(err);
			toast.error(err.error);
		}
	}

	async function __getPage(context, match, sort) {
		context.isFetching = true;
		try {
			const skip = (context.currentPage - 1) * context.pageStep;

			let pipeline = [];

			if (match?.length > 0) pipeline.push({ $match: { $and: match } });

			if (sort) pipeline.push({ $sort: sort });

			pipeline.push({ $skip: skip });
			pipeline.push({ $limit: context.pageStep });

			context.recordsDataBackup = context.recordsData = await getRecords(
				context.dbName,
				context.colName,
				pipeline
			);
		} catch (err) {
			console.error(err);
		} finally {
			context.isFetching = false;
		}
	}

	function __resetFilterFields(context) {
		context.isFetching = true;
		context.recordsData = context.recordsDataBackup;
		context.isFetching = false;
	}

	return {
		__calculateNoOfPages,
		__assignCallback,
		__setRecordsCount,
		__fetchData,
		__findRecords,
		__addRecord,
		__updateRecord,
		__updateRecordsMany,
		__findByField,
		__addField,
		__findById,
		__initRecordsData,
		__deleteRecord,
		__getPage,
		__resetFilterFields,
	};
};
