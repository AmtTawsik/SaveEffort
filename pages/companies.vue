<script setup>
	import { tab_fields } from "@/table_configs/company.json";
	import { config } from "@/table_configs/company.json";
	import { roles } from "@/table_configs/company.json";

	const composable = await import("~/composables/company");
	const globalStore = useGlobalStore();
	const piniaStore = globalStore.companyStore;

	let tableConfig = {};
	let defaultSort = {};

	tableConfig.read = false;
	tableConfig.write = false;

	tableConfig.tableName = { singular: "Company", plural: "Companies" };
	tableConfig.headers = config;
	tableConfig.tab_headers = tab_fields;

	tableConfig.rowMap = new Map();
	tableConfig.groupMap = new Map();

	tableConfig.hideComposable = composable.useCompanyHideDropDown;
	tableConfig.groupComposable = composable.useCompanyGroup;
	tableConfig.changeGroup = changeGroup;
	tableConfig.currentRecord = composable.useCompany;

	tableConfig.defaultSort = defaultSort;
	tableConfig.store = piniaStore.useStore;
	tableConfig.drawerComponent = resolveComponent("SideDrawerCompany");

	function changeGroup(list, evt, header) {
		if (evt.added !== undefined) {
			if (header.parent) {
				list[evt.added.newIndex][header.parent][header.field] =
					list[(evt.added.newIndex + 1) % list.length][header.parent][
						header.field
					];
			} else {
				list[evt.added.newIndex][header.field] =
					list[(evt.added.newIndex + 1) % list.length][header.field];
			}
		}
	}
</script>

<template>
	<RecordsWrapper :tableConfig="tableConfig" :roles="roles" />
</template>
