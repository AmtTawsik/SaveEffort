import * as __store from "~/stores/unique_values";

export default defineNuxtPlugin(() => {
	const store = __store.useStore();

	store.initRecordsData();
});
