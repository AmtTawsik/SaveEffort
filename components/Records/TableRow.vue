<script setup>
	import { EllipsisHorizontalIcon } from "@heroicons/vue/24/solid";

	const { data, tableConfig } = defineProps(["data", "tableConfig"]);

	const emit = defineEmits([
		"update",
		"delete",
		"refreshRecords",
		"drawerOpen",
	]);
	const store = tableConfig.store();
	const isRecordSelected = ref(false);
	const rowData = {
		...data,
	};

	const { getCurrentRecordInfo } = tableConfig.currentRecord();
	const { tableTdVisible } = tableConfig.hideComposable();

	watch(isRecordSelected, (newData, oldData) => {
		if (newData === true) store.selectRecord(rowData._id);
		else store.unselectRecord(rowData._id);
	});

	const detailsHandler = (rowData) => {
		getCurrentRecordInfo(rowData);
		emit("drawerOpen");
	};

	const hasUpdate = computed(() => {
		return tableConfig.headers.some((field) => field.is_update);
	});
</script>

<template>
	<td class="w-4 p-4 rounded-tl-md" scope="row">
		<div class="flex items-center">
			<input
				:id="`checkbox-table-${rowData._id}`"
				type="checkbox"
				v-model="store.selectedRecords"
				:value="rowData._id"
				class="w-5 h-5 text-green-400 rounded-md bg-gray-100 border-gray-300 focus:ring-white focus:ring-0" />
			<label :for="`checkbox-table-${rowData._id}`" class="sr-only"
				>checkbox</label
			>
		</div>
	</td>
	<template v-for="(header, index) in tableConfig.headers" :key="index">
		<td
			v-if="header.is_visible && tableTdVisible[header.name]"
			class="button-open whitespace-nowrap"
			@click="detailsHandler(rowData)">
			<component
				v-if="!header.parent && tableConfig.rowMap.get(header.name)?.component"
				:is="tableConfig.rowMap.get(header.name)?.component"
				:content="rowData[header.field]"
				:image="rowData[header.image_field]"
				:header="header"
				:recordId="rowData._id">
			</component>
			<RecordsTableDataDefault
				v-else-if="
					!header.parent && !tableConfig.rowMap.get(header.name)?.component
				"
				:is="tableConfig.rowMap.get(header.name)?.component"
				:content="rowData[header.field]"
				:header="header"
				:recordId="rowData._id">
			</RecordsTableDataDefault>

			<component
				v-if="header.parent && tableConfig.rowMap.get(header.name)?.component"
				:is="tableConfig.rowMap.get(header.name)?.component"
				:content="rowData[header.parent]"
				:image="rowData[header.image_field]"
				:header="header"
				:recordId="rowData._id">
			</component>
			<RecordsTableDataDefault
				v-else-if="
					header.parent && !tableConfig.rowMap.get(header.name)?.component
				"
				:is="tableConfig.rowMap.get(header.name)?.component"
				:content="rowData[header.parent]"
				:header="header"
				:recordId="rowData._id">
			</RecordsTableDataDefault>
		</td>
	</template>
	<template v-for="(tab, index) in tableConfig.tab_headers" :key="index">
		<template v-for="(header, index) in tab?.fields" :key="index">
			<td
				v-if="header.is_visible && tableTdVisible[header.name]"
				class="button-open whitespace-nowrap"
				@click="detailsHandler(rowData)">
				<RecordsTableDataDefault
					v-if="!header.parent"
					:content="rowData[header.field]"
					:header="header"
					:recordId="rowData._id">
				</RecordsTableDataDefault>
				<RecordsTableDataDefault
					v-else
					:content="rowData[header.parent]"
					:header="header"
					:recordId="rowData._id">
				</RecordsTableDataDefault>
			</td>
		</template>
		<td
			v-if="
				tab.field?.is_visible === true &&
				tab.field?.table_view === true &&
				tableTdVisible[tab.field.name]
			"
			class="button-open whitespace-nowrap"
			@click="detailsHandler(rowData)">
			<RecordsTableDataDefault
				v-if="!tab.field.parent"
				:content="rowData[tab.field.field]"
				:header="tab.field"
				:recordId="rowData._id">
			</RecordsTableDataDefault>
			<RecordsTableDataDefault
				v-else
				:content="rowData[tab.field.parent]"
				:header="tab.field"
				:recordId="rowData._id">
			</RecordsTableDataDefault>
		</td>
	</template>
	<td v-if="tableConfig.write" class="px-3 py-4 rounded-tr-md">
		<button
			:id="`recordsMenuDropdownButton-${rowData._id}`"
			:data-dropdown-toggle="`recordsMenuDropdown-${rowData._id}`"
			data-dropdown-placement="left"
			data-dropdown-offset-skidding="20"
			class="hover:bg-gray-300 rounded-full p-1">
			<EllipsisHorizontalIcon class="w-6 h-6" />
		</button>
		<RecordsMenu
			@update="emit('update')"
			@delete="emit('delete', rowData._id)"
			:id="rowData._id"
			:tableName="tableConfig.tableName.plural"
			:hasUpdate="hasUpdate"
			:hasDelete="tableConfig?.user_role?.delete" />
	</td>
</template>
