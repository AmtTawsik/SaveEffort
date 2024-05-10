const addSaveView = async (tableConfig, saveViewName, clearSaveViewName) => {
  const { saveView, activeSaveView, saveViewList } =
    tableConfig.currentRecord();

  const { tableTdVisible } = tableConfig.hideComposable();
  const { grouped } = tableConfig.groupComposable();
  const { currentUser, addRecordToDB } = useRealmApp();

  const store = tableConfig.store();

  let temp = {};

  temp.name = saveViewName;
  temp.hide = tableTdVisible.value;
  temp.sort = saveView.value.sort;
  temp.filters = saveView.value.filters;
  temp.match = saveView.value.match;
  temp.group = grouped.value;
  temp.user_id = currentUser.id;
  temp.collection = store.colName;

  const { insertedId } = await addRecordToDB(
    useRuntimeConfig().public.APP_DB,
    'saveView',
    temp
  );

  saveViewList.value.push(temp);
  activeSaveView.value = temp;
  saveView.value = temp;
  clearSaveViewName();
};

export default addSaveView;
