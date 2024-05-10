<script setup>
	import { BSON } from "realm-web";
	import { PencilSquareIcon } from "@heroicons/vue/24/outline";

	let { data, header, headers, canEdit } = defineProps([
		"data",
		"header",
		"headers",
		"canEdit",
	]);

	const emit = defineEmits(["updateRecord"]);

	const globalStore = useGlobalStore();
	const isEditing = ref(false);
	const recordData = ref(null);

	if (header && data) {
		headers = [header];
	}

	const editInit = (data) => {
		recordData.value = JSON.parse(JSON.stringify(data));
		recordData.value._id = BSON.ObjectID(recordData.value._id);

		headers.forEach(async (item) => {
			if (item.parent && !recordData.value[item.parent]) {
				recordData.value[item.parent] = {};
			}

			if (item.dropdown && !item.options && item.get_from) {
				const store = globalStore[item.get_from].useStore();

				item.options = [];

				if (store.recordsData === null) {
					await store.initRecordsData().then((data) => {
						data.forEach((item) => {
							item.options.push({
								name: item[item.get_from_field],
								value: JSON.parse(JSON.stringify(item[item.get_from_value])),
							});
						});
					});
				} else {
					store.recordsData.forEach((item) => {
						item.options.push({
							name: item[item.get_from_field],
							value: JSON.parse(JSON.stringify(item[item.get_from_value])),
						});
					});
				}
			}

			if (item?.type === "date") {
				const fieldToFormat = item.parent
					? recordData.value[item.parent][item.field]
					: recordData.value[item.field];

				if (fieldToFormat) {
					let formattedDate = formatHtmlDate(fieldToFormat);

					if (item.parent) {
						recordData.value[item.parent][item.field] = formattedDate;
					} else {
						recordData.value[item.field] = formattedDate;
					}
				}
			}
		});

		isEditing.value = true;
	};
</script>

<template>
	<div v-if="data && (header || headers)" class="flex flex-col gap-4">
		<div class="rounded border border-slate-300">
			<div
				class="flex justify-between items-center px-4 py-2 border-b border-b-slate-300">
				<h3 v-if="header" class="text-sm font-semibold">{{ header.name }}</h3>
				<h3 v-else class="text-sm font-semibold">Basic Information</h3>
				<button
					v-if="canEdit === true"
					@click="editInit(data)"
					class="flex gap-1 items-center">
					<PencilSquareIcon class="w-6 h-6 text-slate-700" />
					<span class="text-sm text-slate-700 font-normal max-lg:hidden"
						>Edit Info</span
					>
				</button>
			</div>

			<div v-if="!isEditing" class="p-4 grid grid-auto-box gap-4">
				<template v-if="header?.is_visible">
					<p
						v-if="!header.parent && data[header.field]"
						class="text-sm font-medium text-gray-600 whitespace-pre-line">
						{{ data[header.field] }}
					</p>
					<p
						v-else-if="header.parent && data[header.parent]"
						class="text-sm font-medium text-gray-600 whitespace-pre-line">
						{{ data[header.parent][header.field] }}
					</p>

					<p v-else class="text-sm font-medium text-gray-600">-</p>
				</template>
				<template v-for="(item, index) in headers" :key="index">
					<div v-if="item.is_visible">
						<span class="text-gray-900 text-sm font-medium">{{
							item.name
						}}</span>
						<p
							v-if="!item.parent && data[item.field]"
							class="text-sm font-medium text-gray-600">
							{{ data[item.field] }}
						</p>
						<p
							v-else-if="item.parent && data[item.parent]"
							class="text-sm font-medium text-gray-600">
							{{ data[item.parent][item.field] }}
						</p>

						<p v-else class="text-sm font-medium text-gray-600">-</p>
					</div>
				</template>
			</div>
			<form
				v-else
				id="details-tab-record-form"
				action="#"
				class="flex flex-col p-4 gap-4"
				@submit.prevent="updateRecordHandler(data)">
				<div class="grid grid-auto-box gap-4">
					<template v-for="(item, index) in headers" :key="index">
						<InputFields
							v-if="item.is_update"
							type="update"
							:header="item"
							:data="recordData" />
					</template>
				</div>
				<div class="flex gap-4">
					<button
						data-modal-toggle="addRecord"
						type="submit"
						class="primary-button-sm">
						Update
					</button>
					<button
						@click="isEditing = false"
						data-modal-toggle="addRecord"
						type="button"
						class="secondary-button-sm">
						Cancel
					</button>
				</div>
			</form>
		</div>
	</div>
</template>

<style>
	.grid-auto-box {
		grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
	}
</style>
