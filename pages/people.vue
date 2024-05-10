<script setup>
	import { tab_fields } from "@/table_configs/person.json";
	import { config } from "@/table_configs/person.json";
	import { roles } from "@/table_configs/person.json";

	const composable = await import("~/composables/person");
	const globalStore = useGlobalStore();
	const piniaStore = globalStore.personStore;

	let tableConfig = {};
	let defaultSort = {};

	tableConfig.read = false;
	tableConfig.write = false;

	tableConfig.tableName = { singular: "Person", plural: "People" };
	tableConfig.headers = config;
	tableConfig.tab_headers = tab_fields;

	tableConfig.rowMap = new Map();
	tableConfig.groupMap = new Map();

	tableConfig.hideComposable = composable.usePersonHideDropDown;
	tableConfig.groupComposable = composable.usePersonGroup;
	tableConfig.changeGroup = changeGroup;
	tableConfig.currentRecord = composable.usePerson;

	tableConfig.defaultSort = defaultSort;
	tableConfig.store = piniaStore.useStore;
	tableConfig.drawerComponent = resolveComponent("SideDrawerPerson");

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
