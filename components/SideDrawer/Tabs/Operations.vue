<script setup>
	import { BSON } from "realm-web";
	import { PencilSquareIcon } from "@heroicons/vue/24/outline";

	const { data, headers, can_edit } = defineProps([
		"data",
		"headers",
		"can_edit",
	]);
	console.log(can_edit);
	const emit = defineEmits(["updateRecord"]);

	const isEditing = ref(false);
	const recordData = ref(null);

	const editInit = (__data) => {
		recordData.value = JSON.parse(JSON.stringify(__data));
		recordData.value._id = BSON.ObjectID(recordData.value._id);

		headers.forEach(async (header) => {
			console.log(header);
			if (header.dropdown && !header.options && header.get_from) {
				const store = globalStore[header.get_from].useStore();

				header.options = [];

				if (store.recordsData === null) {
					await store.initRecordsData().then((__data) => {
						__data.forEach((item) => {
							header.options.push({
								name: item[header.get_from_field],
								value: JSON.parse(JSON.stringify(item[header.get_from_value])),
							});
						});
					});
				} else {
					store.recordsData.forEach((item) => {
						header.options.push({
							name: item[header.get_from_field],
							value: JSON.parse(JSON.stringify(item[header.get_from_value])),
						});
					});
				}
			}

			if (header?.type === "date" && !header?.parent) {
				let tempDate = new Date(recordData.value[header.field]);

				let date = tempDate.getDate();
				if (date < 10) {
					date = date.toString().padStart(2, "0");
				}

				let month = tempDate.getMonth() + 1;
				if (month < 10) {
					month = month.toString().padStart(2, "0");
				}

				let year = tempDate.getFullYear();

				recordData.value[header.field] = [year, month, date].join("-");
			}
		});

		isEditing.value = true;
	};

	const updateRecordHandler = async (data) => {
		const { currentUser } = useRealmApp();
		// @TODO: Check if data is empty

		let changedFields = [];
		let set_data = {};

		headers.forEach((header) => {
			if (header.is_update && !header.parent) {
				const field = header.field;

				if (header.type === "date") {
					let date1 = new Date(recordData.value[field]);
					let date2 = new Date(data[field]);

					if (date1.getTime() !== date2.getTime()) {
						changedFields.push({
							type: "edited",
							field: field,
							before: data[field],
							after: recordData.value[field],
						});
						set_data[field] = recordData.value[field];

						data[field] = date1;
					}
				} else if (
					data.hasOwnProperty(field) &&
					data[field] !== recordData.value[field]
				) {
					changedFields.push({
						type: "edited",
						field: field,
						before: data[field],
						after: recordData.value[field],
					});
					set_data[field] = recordData.value[field];
					data[field] = recordData.value[field];
					if (header.is_assign_dropdown)
						addAssignHeader(recordData.value[field], header);
				} else if (!data.hasOwnProperty(field) && recordData.value[field]) {
					changedFields.push({
						type: "added",
						field: field,
						before: null,
						after: recordData.value[field],
					});
					data[field] = recordData.value[field];
					set_data[field] = recordData.value[field];
					if (header.is_assign_dropdown)
						addAssignHeader(recordData.value[field], header);
				}
			} else if (header.is_update && header.parent) {
				const parent = header.parent;
				const field = header.field;

				if (header.type === "date") {
					let date1 = new Date(recordData.value[parent][field]);
					let date2 = new Date(data[parent][field]);

					if (date1.getTime() !== date2.getTime()) {
						changedFields.push({
							type: "edited",
							field: parent,
							before: data[parent][field],
							after: recordData.value[parent][field],
						});
						data[parent][field] = date1;
						set_data[parent][field] = date1;
					}
				} else if (
					data[parent].hasOwnProperty(field) &&
					data[parent][field] !== recordData.value[parent][field]
				) {
					changedFields.push({
						type: "edited",
						field: parent,
						before: data[parent][field],
						after: recordData.value[parent][field],
					});
					data[parent][field] = recordData.value[parent][field];
					set_data[parent][field] = recordData.value[parent][field];
					if (header.is_assign_dropdown)
						addAssignHeader(recordData.value[parent][field], header);
				} else if (
					!data[parent]?.hasOwnProperty(field) &&
					recordData.value[parent][field]
				) {
					changedFields.push({
						type: "added",
						field: parent,
						before: null,
						after: recordData.value[parent][field],
					});
					data[parent][field] = recordData.value[parent][field];
					set_data[parent][field] = recordData.value[parent][field];
					if (header.is_assign_dropdown)
						addAssignHeader(recordData.value[parent][field], header);
				}
			}
		});

		console.log(changedFields);

		if (!data.update_logs || data.update_logs.length === 0)
			data.update_logs = [];

		if (changedFields.length > 0) {
			data.update_logs.push({
				fields: changedFields,
				updated_at: new Date(),
				updated_by: currentUser?.id,
			});

			set_data.update_logs = data.update_logs;
			console.log(set_data, data);
			isEditing.value = false;
			emit("updateRecord", { set: set_data, data: data });
		}
	};
</script>

<template>
	<div v-if="data" class="flex flex-col gap-4">
		<div class="rounded border border-slate-300">
			<div
				class="flex justify-between items-center px-4 py-2 border-b border-b-slate-300">
				<h3 class="text-sm font-semibold">Basic Information</h3>
				<button
					v-if="can_edit === true"
					@click="editInit(data)"
					class="flex gap-1 items-center">
					<PencilSquareIcon class="w-6 h-6 text-slate-700" />
					<span class="text-sm text-slate-700 font-normal max-lg:hidden"
						>Edit Info</span
					>
				</button>
			</div>

			<div
				v-if="!isEditing"
				class="p-4 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-y-4">
				<template v-for="(header, index) in headers" :key="index">
					<div v-if="header.is_visible">
						<span class="text-slate-500 text-sm font-medium">{{
							header.name
						}}</span>
						<p
							v-if="data[header.field]"
							class="text-sm font-semibold text-gray-700">
							{{ data[header.field] }}
						</p>

						<p v-else class="text-sm font-semibold text-gray-700">-</p>
					</div>
				</template>
			</div>
			<form
				v-else
				id="add-record-form"
				action="#"
				class="flex flex-col p-4 gap-4"
				@submit.prevent="updateRecordHandler(data)">
				<div class="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
					<template v-for="(header, index) in headers" :key="index">
						<div class="flex flex-col gap-2" v-if="header.is_update">
							<label
								:for="`add-${header.name}`"
								class="block text-slate-500 text-sm font-medium dark:text-white"
								>{{ header.name }}</label
							>

							<PeopleDropdown
								v-if="header.is_assign_dropdown"
								:header="header"
								@change="handleAssignDropdown($event, header)" />

							<textarea
								v-else-if="
									header.parent === null &&
									header.dropdown === false &&
									header.type === 'textarea'
								"
								v-model="recordData[header.field]"
								:type="header.type"
								:name="`add-${header.name}`"
								:id="`add-${header.name}`"
								class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
								:placeholder="header.name"
								required />
							<textarea
								v-else-if="
									header.parent !== null &&
									header.dropdown === false &&
									header.type === 'textarea'
								"
								v-model="recordData[header.parent][header.field]"
								:type="header.type"
								:name="`add-${header.name}`"
								:id="`add-${header.name}`"
								class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
								:placeholder="header.name"
								required />
							<input
								v-else-if="
									header.parent === null &&
									header.dropdown === false &&
									header.type !== 'textarea'
								"
								v-model="recordData[header.field]"
								:type="header.type"
								:name="`add-${header.name}`"
								:id="`add-${header.name}`"
								class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
								:placeholder="header.name"
								required />
							<input
								v-else-if="
									header.parent !== null &&
									header.dropdown === false &&
									header.type !== 'textarea'
								"
								v-model="recordData[header.parent][header.field]"
								:type="header.type"
								:name="`add-${header.name}`"
								:id="`add-${header.name}`"
								class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
								:placeholder="header.name"
								required />

							<select
								v-else-if="header.parent === null && header.dropdown === true"
								v-model="recordData[header.field]"
								:id="`add-${header.name}`"
								class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
								required>
								<option value="" disabled>Select {{ header.name }}</option>
								<option
									v-for="(opt, index) in header.options"
									:key="index"
									:value="opt.value">
									{{ opt.name }}
								</option>
							</select>
							<select
								v-else-if="header.parent !== null && header.dropdown === true"
								v-model="recordData[header.parent][header.field]"
								:id="`add-${header.name}`"
								class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
								required>
								<option value="" disabled>Select {{ header.name }}</option>
								<option
									v-for="(opt, index) in header.options"
									:key="index"
									:value="opt.value">
									{{ opt.name }}
								</option>
							</select>
						</div>
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
				<!-- <vSelect :options="testArray" /> -->
			</form>
		</div>
	</div>
</template>
