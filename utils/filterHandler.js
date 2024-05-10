const filterHandler = async (filters, tableConfig, refreshTableHandler) => {
  const { saveView, activeSaveView } = tableConfig.currentRecord();

  const store = tableConfig.store();

  let matchPipeline = [];

  if (filters) {
    store.currentPage = 1;
    matchPipeline = await getPipeline(filters);
    if (matchPipeline) {
      saveView.value.filters = filters;
      saveView.value.match = matchPipeline;
      activeSaveView.value = null;
      await store.fetchData(saveView.value?.match, saveView.value?.sort);
    }
  } else if (saveView.value?.sort) {
    saveView.value.filters = null;
    saveView.value.match = null;
    await store.fetchData(saveView.value?.match, saveView.value?.sort);
  } else {
    saveView.value.filters = null;
    saveView.value.match = null;
    await store.fetchData(saveView.value?.match, tableConfig.defaultSort);
  }

  refreshTableHandler();
};

export default filterHandler;
