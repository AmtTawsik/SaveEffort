export const useProject = () => {
	const currRecord = useState("project", () => {});
	const drawer = useState("projectDrawer", () => {});
	const bucket = useState("projectBucket", () => {});
	const updateModal = useState("projectUpdateModal", () => {});
	const deleteModal = useState("projectDeleteModal", () => {});
	const saveView = useState("projectSaveView", () => {
		return {
			name: null,
			filters: null,
			match: null,
			sort: null,
			hide: null,
			group: null,
		};
	});

	const activeSaveView = useState("projectActiveSaveView", () => {
		return null;
	});

	const saveViewList = useState("projectSaveViewList", () => {
		return null;
	});

	const showClearButton = useState("projectSaveViewClearButton", () => {
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

export const useProjectHideDropDown = () => {
	const tableTdVisible = useState("projectTdVisible", () => {
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

export const useProjectGroup = () => {
	const grouped = useState("projectGroup", () => ({
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
