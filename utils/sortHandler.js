const sortHandler = async (sort, tableConfig, refreshTableHandler) => {
	const { saveView, activeSaveView } = tableConfig.currentRecord();
	const store = tableConfig.store();

	if (sort) {
		saveView.value.sort = sort;
		activeSaveView.value = null;
		await store.fetchData(saveView.value?.match, saveView.value?.sort);
		refreshTableHandler();
	}
};

export default sortHandler;
