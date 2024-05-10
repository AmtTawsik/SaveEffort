import { defineStore } from "pinia";

export const useStore = defineStore("dealCounter", {
	state: () => ({
		recordsData: null,
		recordsDataBackup: null,
		recordsDataLength: 0,
		recordsDataBackupLength: 0,
		totalPages: 0,
		currentPage: 1,
		pageStep: 15,
		selectedRecords: [],
		defaultSort: null,
		defaultMatch: null,
		isFetching: true,
		isAdding: false,
		dbName: useRuntimeConfig().public.APP_DB,
		colName: "deals",
	}),

	getters: {
		data: (state) => state.recordsData,
	},

	actions: {
		calculateNoOfPages() {
			const { __calculateNoOfPages } = useStores();
			__calculateNoOfPages(this);
		},

		async setRecordsCount(pipeline) {
			const { __setRecordsCount } = useStores();
			await __setRecordsCount(this, pipeline);
		},

		async fetchData(match, sort) {
			const { __fetchData } = useStores();
			await __fetchData(this, match, sort);
		},

		async getPage(match, sort) {
			const { __getPage } = useStores();
			await __getPage(this, match, sort);
		},

		async findRecords(match) {
			const { __findRecords } = useStores();
			const data = await __findRecords(this, match);
			return data;
		},

		async initRecordsData(match, sort) {
			const { __initRecordsData } = useStores();
			const data = await __initRecordsData(this, match, sort);
			return data;
		},

		selectRecord(id) {
			this.selectedRecords.push(id);
		},

		unselectRecord(id) {
			const index = this.selectedRecords.indexOf(id);
			this.selectedRecords.splice(index, 1);
		},

		async findByField(field, value) {
			const { __findByField } = useStores();
			const data = await __findByField(this, field, value);
			return data;
		},

		async findById(id) {
			const { __findById } = useStores();
			const data = await __findById(this, id);
			return data;
		},

		async assignCallback(header, assign_to_id, globalStore) {
			const { __assignCallback } = useStores();
			await __assignCallback(header, assign_to_id, globalStore);
		},

		async addRecord(data, assign_headers, globalStore) {
			const { __addRecord } = useStores();
			await __addRecord(this, data, assign_headers, globalStore);
		},

		async updateRecord(data) {
			const { __updateRecord } = useStores();
			await __updateRecord(this, data);
		},

		async addField(set_data, record, assign_headers) {
			const { __addField } = useStores();
			await __addField(this, set_data, record, assign_headers);
		},

		async deleteRecord(_id, saveView) {
			const { __deleteRecord } = useStores();
			await __deleteRecord(this, _id, saveView);
		},

		async updateRecordsMany(set_data, saveView) {
			const { __updateRecordsMany } = useStores();
			await __updateRecordsMany(this, set_data, saveView);
		},

		resetFilterFields() {
			const { __resetFilterFields } = useStores();
			__resetFilterFields(this);
		},
	},
});
