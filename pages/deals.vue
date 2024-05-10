<script setup>
	import { tab_fields } from "@/table_configs/deal.json";
	import { config } from "@/table_configs/deal.json";
	import { roles } from "@/table_configs/deal.json";

	const composable = await import("~/composables/deal");
	const globalStore = useGlobalStore();
	const piniaStore = globalStore.dealStore;

	let tableConfig = {};
	let defaultSort = {};

	tableConfig.read = false;
	tableConfig.write = false;

	tableConfig.tableName = { singular: "Deal", plural: "Deals" };
	tableConfig.headers = config;
	tableConfig.tab_headers = tab_fields;

	tableConfig.rowMap = new Map();
	tableConfig.groupMap = new Map();

	tableConfig.hideComposable = composable.useDealHideDropDown;
	tableConfig.groupComposable = composable.useDealGroup;
	tableConfig.changeGroup = changeGroup;
	tableConfig.currentRecord = composable.useDeal;

	tableConfig.defaultSort = defaultSort;
	tableConfig.store = piniaStore.useStore;
	tableConfig.drawerComponent = resolveComponent("SideDrawerDeal");

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
