async function applySaveView(tableConfig, item, toggleDropdown) {
  const { saveView, activeSaveView } = tableConfig.currentRecord();
  const store = tableConfig.store();

  if (saveView.value?.name === item.name) return;

  const { tableTdVisible } = tableConfig.hideComposable();
  const { setGroup, unsetGroup } = tableConfig.groupComposable();

  store.resetFilterFields();
  store.currentPage = 1;
  saveView.value = JSON.parse(JSON.stringify(item));
  activeSaveView.value = item;

  if (item.match && item.sort) await store.fetchData(item?.match, item?.sort);
  else if (item.match)
    await store.fetchData(item?.match, tableConfig.defaultSort);
  else if (item.sort) await store.fetchData(null, item?.sort);
  else await store.fetchData(null, tableConfig.defaultSort);

  if (item.hide) tableTdVisible.value = JSON.parse(JSON.stringify(item.hide));
  if (item.group) setGroup(item.group);
  else unsetGroup();

  toggleDropdown();
}

export default applySaveView;
