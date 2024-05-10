export const useDeal = () => {
	const currRecord = useState("deal", () => {});
	const drawer = useState("dealDrawer", () => {});
	const bucket = useState("dealBucket", () => {});
	const updateModal = useState("dealUpdateModal", () => {});
	const deleteModal = useState("dealDeleteModal", () => {});
	const saveView = useState("dealSaveView", () => {
		return {
			name: null,
			filters: null,
			match: null,
			sort: null,
			hide: null,
			group: null,
		};
	});

	const activeSaveView = useState("dealActiveSaveView", () => {
		return null;
	});

	const saveViewList = useState("dealSaveViewList", () => {
		return null;
	});

	const showClearButton = useState("dealSaveViewClearButton", () => {
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

export const useDealHideDropDown = () => {
	const tableTdVisible = useState("dealTdVisible", () => {
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

export const useDealGroup = () => {
	const grouped = useState("dealGroup", () => ({
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
