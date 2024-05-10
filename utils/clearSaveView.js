const clearSaveView = async (tableConfig, toggleDropdown) => {
  const { saveView, activeSaveView } = tableConfig.currentRecord();
  const store = tableConfig.store();

  const { unsetGroup } = tableConfig.groupComposable();

  store.resetFilterFields();
  store.currentPage = 1;

  saveView.value = {
    name: 'Save view',
    filter: null,
    sort: tableConfig.defaultSort,
    hide: null,
    group: null,
  };

  activeSaveView.value = null;
  unsetGroup();

  await store.fetchData(null, tableConfig.defaultSort);

  const { tdInit } = tableConfig.hideComposable();
  tdInit(tableConfig.headers, tableConfig.tab_headers);

  toggleDropdown();
};

export default clearSaveView;
