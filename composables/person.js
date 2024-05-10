export const usePerson = () => {
	const currRecord = useState("person", () => {});
	const drawer = useState("personDrawer", () => {});
	const bucket = useState("personBucket", () => {});
	const updateModal = useState("personUpdateModal", () => {});
	const deleteModal = useState("personDeleteModal", () => {});
	const saveView = useState("personSaveView", () => {
		return {
			name: null,
			filters: null,
			match: null,
			sort: null,
			hide: null,
			group: null,
		};
	});

	const activeSaveView = useState("personActiveSaveView", () => {
		return null;
	});

	const saveViewList = useState("personSaveViewList", () => {
		return null;
	});

	const showClearButton = useState("personSaveViewClearButton", () => {
		return false;
	});

	const getCurrentRecordInfo = (info) => {
		currRecord.value = info;
	};

	return {
		drawer,
		bucket,
		saveView,
		currRecord,
		updateModal,
		deleteModal,
		activeSaveView,
		saveViewList,
		showClearButton,
		getCurrentRecordInfo,
	};
};

export const usePersonHideDropDown = () => {
	const tableTdVisible = useState("personTdVisible", () => {
		let isVisible = {};

		return isVisible;
	});

	const tdInit = (tableHeaders, tabHeaders) => {
		tableTdVisible.value = new Object();
		tableHeaders.forEach((item, index) => {
			if (index >= 10 && item.is_visible)
				tableTdVisible.value[item.name] = false;
			else if (item.is_visible) tableTdVisible.value[item.name] = true;
		});

		for (const tab in tabHeaders) {
			tabHeaders[tab]?.fields?.forEach((item) => {
				if (item?.table_view !== false && item.is_visible)
					tableTdVisible.value[item.name] = false;
			});
		}
	};

	const tdToggle = (state) => {
		for (const key in tableTdVisible.value) {
			tableTdVisible.value[key] = state;
		}
	};

	const showAllTableTd = () => {
		tdToggle(true);
	};

	const hideAllTableTd = () => {
		tdToggle(false);
	};

	return { tableTdVisible, tdInit, showAllTableTd, hideAllTableTd };
};

export const usePersonGroup = () => {
	const grouped = useState("personGroup", () => ({
		active: false,
		groupedBy: null,
		header: null,
	}));

	const setGroup = (item) => {
		grouped.value = item;
	};

	const unsetGroup = () => {
		grouped.value = {
			active: false,
			groupedBy: null,
			header: null,
		};
	};

	return { grouped, setGroup, unsetGroup };
};
