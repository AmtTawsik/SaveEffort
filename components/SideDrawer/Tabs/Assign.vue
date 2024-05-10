<template>
	<div v-if="data && header" class="flex flex-col gap-4">
		<div class="flex flex-col gap-4">
			<h1 class="text-xl font-semibold">Current {{ header.name }}</h1>
			<div v-if="data[header.field]?.length > 0" class="flex flex-wrap gap-4">
				<template v-for="(record, index) in data[header.field]" :key="index">
					<div
						v-if="header.store_assign_info && bucket.get(record.id.toString())"
						class="flex flex-col gap-4 p-4 bg-gray-100 rounded-lg h-fit">
						<div class="flex gap-4 w-full justify-between items-center">
							<div class="flex gap-2 items-center">
								<template v-if="header.get_from_field_image">
									<img
										v-if="
											bucket.get(record.id.toString()) &&
											bucket.get(record.id.toString())[
												header.get_from_field_image
											]
										"
										:src="
											bucket.get(record.id.toString())[
												header.get_from_field_image
											]
										"
										class="w-8 h-8 rounded-full"
										alt="Image" />
									<img
										v-else
										src="~/assets/images/default-user.png"
										class="w-8 h-8 rounded-full"
										alt="Image" />
								</template>

								<h1 class="text-lg font-medium">
									{{ bucket.get(record.id.toString())[header.get_from_field] }}
								</h1>
							</div>

							<div class="flex gap-1">
								<button
									v-if="
										(startDate || endDate || percentageAllocation) && canEdit
									"
									@click="editAssignInit(record, data)"
									class="inline-flex justify-center items-center w-fit h-fit p-2 rounded-full text-blue-500 hover:bg-blue-500 hover:text-white aspect-square"
									type="button">
									<PencilIcon class="w-5 h-5" />
								</button>
								<button
									v-if="canEdit"
									@click="
										deleteAssign(data, getRecord(record.id.toString()), index)
									"
									class="inline-flex justify-center items-center w-fit h-fit p-2 rounded-full text-red-500 hover:bg-red-500 hover:text-white aspect-square"
									type="button">
									<TrashIcon class="w-5 h-5" />
								</button>
							</div>
						</div>
						<div
							v-if="editAssignData?.id === record.id.toString()"
							class="flex flex-col gap-4 w-full">
							<div class="grid grid-cols-2 gap-4">
								<div
									v-if="startDate"
									class="flex flex-col min-w-[200px] max-w-[250px]">
									<label
										for="assign_start_date"
										class="block mb-2 text-base font-medium text-gray-900 dark:text-white"
										>Start date</label
									>
									<input
										id="assign_start_date"
										v-model="editAssignData.start_date"
										type="date"
										name="assign_start_date"
										class="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 block max-w-xs p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
										placeholder="Start date"
										required />
								</div>
								<div
									v-if="endDate"
									class="flex flex-col min-w-[200px] max-w-[250px]">
									<label
										for="assign_end_date"
										class="block mb-2 text-base font-medium text-gray-900 dark:text-white"
										>End date</label
									>
									<input
										id="assign_end_date"
										v-model="editAssignData.end_date"
										type="date"
										name="assign_end_date"
										class="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 block max-w-xs p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
										placeholder="End date"
										required />
								</div>
								<div
									v-if="percentageAllocation"
									class="flex flex-col min-w-[200px] max-w-[250px]">
									<label
										for="assign_percentage_allocation"
										class="block mb-2 text-base font-medium text-gray-900 dark:text-white"
										>Percentage allocation</label
									>
									<select
										v-model="editAssignData.percentage_allocation"
										id="assign_percentage_allocation"
										class="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-primary-500 focus:border-primary-500 block max-w-xs p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
										required>
										<option value="" disabled>Select %</option>
										<option
											v-for="(item, index) in allocationOptions"
											:key="index"
											:value="item">
											{{ item }} %
										</option>
									</select>
								</div>
							</div>
							<div class="flex gap-4">
								<button
									@click="confirmEditAssign(data, index)"
									class="primary-button-sm">
									Done
								</button>
								<button
									@click="editAssignData = null"
									class="secondary-button-sm">
									Cancel
								</button>
							</div>
						</div>
						<div
							v-else-if="startDate || endDate || percentageAllocation"
							class="flex flex-col gap-4">
							<div class="flex gap-4">
								<div v-if="startDate">
									<span class="text-gray-900 font-medium">Start date</span>
									<p class="text-sm text-gray-500">
										{{ formatDate(record.start_date) }}
									</p>
								</div>
								<div v-if="endDate">
									<span class="text-gray-900 font-medium">End date</span>
									<p class="text-sm text-gray-500">
										{{ formatDate(record.end_date) }}
									</p>
								</div>
							</div>
							<div v-if="percentageAllocation" class="flex flex-col gap-2">
								<div class="flex justify-between">
									<span class="text-gray-900 font-medium">Allocation</span>
									<span
										v-if="record.percentage_allocation"
										class="text-sm font-medium text-blue-700 dark:text-white"
										>{{ record.percentage_allocation }} %</span
									>
									<span
										v-else
										class="text-sm font-medium text-blue-700 dark:text-white"
										>30%</span
									>
								</div>
								<div
									class="w-full h-4 bg-gray-200 rounded-full dark:bg-gray-700">
									<div
										v-if="record.percentage_allocation"
										class="h-4 bg-blue-600 rounded-full dark:bg-blue-500"
										:style="`width: ${record.percentage_allocation}%`"></div>
									<div
										v-else
										class="h-4 bg-blue-600 rounded-full dark:bg-blue-500"
										style="width: 30%"></div>
								</div>
							</div>
						</div>
					</div>
					<div
						v-else-if="
							!header.store_assign_info && bucket.get(record.toString())
						"
						class="flex flex-col gap-4 p-4 bg-gray-100 rounded-lg h-fit">
						<div class="flex gap-4 w-full justify-between items-center">
							<h1 class="text-lg font-medium">
								{{ bucket.get(record.toString())[header.get_from_field] }}
							</h1>
							<div class="flex gap-1">
								<button
									v-if="
										(startDate || endDate || percentageAllocation) && canEdit
									"
									@click="editAssignInit(record, data)"
									class="inline-flex justify-center items-center w-fit h-fit p-2 rounded-full text-blue-500 hover:bg-blue-500 hover:text-white aspect-square"
									type="button">
									<PencilIcon class="w-5 h-5" />
								</button>
								<button
									v-if="canEdit"
									@click="
										deleteAssign(data, bucket.get(record.toString()), index)
									"
									class="inline-flex justify-center items-center w-fit h-fit p-2 rounded-full text-red-500 hover:bg-red-500 hover:text-white aspect-square"
									type="button">
									<TrashIcon class="w-5 h-5" />
								</button>
							</div>
						</div>
						<div
							v-if="editAssignData?.record_id === record.toString()"
							class="flex flex-col gap-4 w-full">
							<div class="grid grid-cols-2 gap-4">
								<div
									v-if="startDate"
									class="flex flex-col min-w-[200px] max-w-[250px]">
									<label
										for="assign_start_date"
										class="block mb-2 text-base font-medium text-gray-900 dark:text-white"
										>Start date</label
									>
									<input
										id="assign_start_date"
										v-model="editAssignData.start_date"
										type="date"
										name="assign_start_date"
										class="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 block max-w-xs p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
										placeholder="Start date"
										required />
								</div>
								<div
									v-if="endDate"
									class="flex flex-col min-w-[200px] max-w-[250px]">
									<label
										for="assign_end_date"
										class="block mb-2 text-base font-medium text-gray-900 dark:text-white"
										>End date</label
									>
									<input
										id="assign_end_date"
										v-model="editAssignData.end_date"
										type="date"
										name="assign_end_date"
										class="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 block max-w-xs p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
										placeholder="End date"
										required />
								</div>
								<div
									v-if="percentageAllocation"
									class="flex flex-col min-w-[200px] max-w-[250px]">
									<label
										for="assign_percentage_allocation"
										class="block mb-2 text-base font-medium text-gray-900 dark:text-white"
										>Percentage allocation</label
									>
									<select
										v-model="editAssignData.percentage_allocation"
										id="assign_percentage_allocation"
										class="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-primary-500 focus:border-primary-500 block max-w-xs p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
										required>
										<option value="" disabled>Select %</option>
										<option
											v-for="(item, index) in allocationOptions"
											:key="index"
											:value="item">
											{{ item }} %
										</option>
									</select>
								</div>
							</div>
							<div class="flex gap-4">
								<button
									@click="confirmEditAssign(data, index)"
									class="primary-button-sm">
									Done
								</button>
								<button
									@click="editAssignData = null"
									class="secondary-button-sm">
									Cancel
								</button>
							</div>
						</div>
						<div
							v-else-if="startDate || endDate || percentageAllocation"
							class="flex flex-col gap-4">
							<div class="flex gap-4">
								<div v-if="startDate">
									<span class="text-gray-900 font-medium">Start date</span>
									<p class="text-sm text-gray-500">
										{{
											formatDate(getRecordAllocation(record, data)?.start_date)
										}}
									</p>
								</div>
								<div v-if="endDate">
									<span class="text-gray-900 font-medium">End date</span>
									<p class="text-sm text-gray-500">
										{{
											formatDate(getRecordAllocation(record, data)?.end_date)
										}}
									</p>
								</div>
							</div>
							<div v-if="percentageAllocation" class="flex flex-col gap-2">
								<div class="flex justify-between">
									<span class="text-gray-900 font-medium">Allocation</span>
									<span
										v-if="
											getRecordAllocation(record, data)?.percentage_allocation
										"
										class="text-sm font-medium text-blue-700 dark:text-white"
										>{{
											getRecordAllocation(record, data)?.percentage_allocation
										}}
										%</span
									>
									<span
										v-else
										class="text-sm font-medium text-blue-700 dark:text-white"
										>30%</span
									>
								</div>
								<div
									class="w-full h-4 bg-gray-200 rounded-full dark:bg-gray-700">
									<div
										v-if="
											getRecordAllocation(record, data)?.percentage_allocation
										"
										class="h-4 bg-blue-600 rounded-full dark:bg-blue-500"
										:style="`width: ${
											getRecordAllocation(record, data)?.percentage_allocation
										}%`"></div>
									<div
										v-else
										class="h-4 bg-blue-600 rounded-full dark:bg-blue-500"
										style="width: 30%"></div>
								</div>
							</div>
						</div>
					</div>
				</template>
			</div>
		</div>
		<div>
			<button
				class="primary-button"
				v-if="!isAdd && canEdit"
				@click="isAdd = true">
				Assign {{ header.name }}
			</button>
			<div
				v-if="isAdd && canEdit"
				class="flex flex-col gap-4 p-4 bg-gray-100 rounded-xl shadow-sm w-fit">
				<div class="grid grid-cols-2 gap-4">
					<div class="flex flex-col gap-2 justify-end">
						<label
							:for="`add-${header.name}`"
							class="block text-base font-medium text-gray-900 dark:text-white"
							>Select {{ header.name }}</label
						>
						<InputAssignDropdown
							:header="header"
							@change="handleAssignDropdown($event)" />
					</div>
					<div
						v-if="startDate"
						class="flex flex-col min-w-[200px] max-w-[250px]">
						<label
							for="assign_start_date"
							class="block mb-2 text-base font-medium text-gray-900 dark:text-white"
							>Start date</label
						>
						<input
							id="assign_start_date"
							type="date"
							name="assign_start_date"
							v-model="start_date"
							class="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 block max-w-xs p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
							placeholder="Start date"
							required />
					</div>
					<div v-if="endDate" class="flex flex-col min-w-[200px] max-w-[250px]">
						<label
							for="assign_end_date"
							class="block mb-2 text-base font-medium text-gray-900 dark:text-white"
							>End date</label
						>
						<input
							id="assign_end_date"
							type="date"
							name="assign_end_date"
							v-model="end_date"
							class="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 block max-w-xs p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
							placeholder="End date"
							required />
					</div>
					<div
						v-if="percentageAllocation"
						class="flex flex-col min-w-[200px] max-w-[250px]">
						<label
							for="assign_percentage_allocation"
							class="block mb-2 text-base font-medium text-gray-900 dark:text-white"
							>Percentage allocation</label
						>
						<select
							id="assign_percentage_allocation"
							v-model="percentage_allocation"
							class="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-primary-500 focus:border-primary-500 block max-w-xs p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
							required>
							<option value="" disabled>Select %</option>
							<option
								v-for="(item, index) in allocationOptions"
								:key="index"
								:value="item">
								{{ item }} %
							</option>
						</select>
					</div>
				</div>
				<div class="flex gap-4 pt-2">
					<button @click="confirmAssign(data)" class="primary-button-sm w-fit">
						Assign
					</button>
					<button @click="cancelAssign()" class="secondary-button-sm w-fit">
						Cancel
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { TrashIcon, PencilIcon } from "@heroicons/vue/24/outline";

	const {
		data,
		header,
		canEdit,
		store,
		startDate,
		endDate,
		percentageAllocation,
	} = defineProps([
		"data",
		"header",
		"canEdit",
		"store",
		"startDate",
		"endDate",
		"percentageAllocation",
	]);

	const { currentUser } = useRealmApp();
	const globalStore = useGlobalStore();

	const toStore = store;
	const fromStore = globalStore[header.get_from]?.useStore();
	const isAdd = ref(false);
	const editAssignData = ref(null);
	const assigningTo = ref(null);
	const bucket = ref(new Map());
	const allocationOptions = ref([]);
	const start_date = ref([]);
	const end_date = ref([]);
	const percentage_allocation = ref([]);

	await fromStore.initRecordsData();

	const getRecord = async (id) => {
		let temp = bucket.value.get(id.toString());

		if (!temp) {
			const tempData = await fromStore.findById(id);

			bucket.value.set(id.toString(), tempData);

			return tempData;
		} else {
			return temp;
		}
	};

	const getRecordAllocation = (id, data) => {
		const temp = bucket.value.get(id.toString());

		if (!temp || !temp[header.assign_to_field]) return null;

		return temp[header.assign_to_field]?.find(
			(record) => record?.id?.toString() === data?._id.toString()
		);
	};

	if (data && header) {
		data[header.field]?.forEach((item) => {
			if (header.store_assign_info) getRecord(item.id);
			else getRecord(item);
		});
	}

	for (let index = 10; index < 100; index = index + 10) {
		allocationOptions.value.push(index);
	}

	const handleAssignDropdown = async (__data) => {
		if (__data) assigningTo.value = await fromStore.findById(__data);
	};

	const cancelAssign = () => {
		isAdd.value = false;
		assigningTo.value = null;
	};

	const deleteAssign = async (data, assignedTo, index) => {
		let i;
		let toUpdateLogs = {};
		let fromUpdateLogs = {};
		let toStoreSetData = {};
		let fromStoreSetData = {};
		let toIdField = `${header.field}_ids`;
		let fromIdField = `${header.assign_to_field}_ids`;

		assignedTo = await assignedTo;

		for (i = 0; i < assignedTo[header.assign_to_field]?.length; i++) {
			const element = assignedTo[header.assign_to_field][i];

			if (element?.id?.toString() === data._id.toString()) {
				break;
			} else if (element.toString() === data._id.toString()) {
				break;
			}
		}

		toUpdateLogs = {
			type: "assign",
			sub_type: "delete",
			field: header.field,
			to: assignedTo._id,
			updated_at: new Date(),
			updated_by: currentUser?.id,
		};

		fromUpdateLogs = {
			type: "assign",
			sub_type: "delete",
			field: header.assign_to_field,
			to: data._id,
			updated_at: new Date(),
			updated_by: currentUser?.id,
		};

		data[header.field].splice(index, 1);

		if (data[toIdField]) {
			data[toIdField].splice(index, 1);
			toStoreSetData[toIdField] = data[toIdField];
		}

		if (!data.update_logs) {
			data.update_logs = [];
		}

		data.update_logs.push(toUpdateLogs);

		assignedTo[header.assign_to_field].splice(i, 1);

		if (assignedTo[fromIdField]) {
			assignedTo[fromIdField].splice(i, 1);
			fromStoreSetData[fromIdField] = assignedTo[fromIdField];
		}

		if (!assignedTo.update_logs) {
			assignedTo.update_logs = [];
		}

		assignedTo.update_logs.push(fromUpdateLogs);

		toStoreSetData[header.field] = data[header.field];
		toStoreSetData.update_logs = data.update_logs;

		fromStoreSetData[header.assign_to_field] =
			assignedTo[header.assign_to_field];
		fromStoreSetData.update_logs = assignedTo.update_logs;

		toStore.addField(toStoreSetData, data);
		fromStore.addField(fromStoreSetData, assignedTo);
	};

	const confirmEditAssign = (data, index) => {
		if (
			editAssignData.value?.id &&
			editAssignData.value?.start_date &&
			editAssignData.value?.end_date &&
			editAssignData.value?.percentage_allocation
		) {
			if (header.store_assign_info) {
				data[header.field][index].id = editAssignData.value.id;
				data[header.field][index].start_date = new Date(
					editAssignData.value.start_date
				);
				data[header.field][index].end_date = new Date(
					editAssignData.value.end_date
				);
				data[header.field][index].percentage_allocation =
					editAssignData.value.percentage_allocation;
				editAssignData.value = null;

				let set_data = {};
				set_data[header.field] = data[header.field];

				toStore.addField(set_data, data);
			} else {
				let allocation = getRecordAllocation(
					editAssignData.value?.record_id,
					data
				);

				let record = bucket.value.get(editAssignData.value?.record_id);

				allocation.id = editAssignData.value.id;
				allocation.start_date = new Date(editAssignData.value.start_date);
				allocation.end_date = new Date(editAssignData.value.end_date);
				allocation.percentage_allocation =
					editAssignData.value.percentage_allocation;

				let set_data = {};
				set_data[header.assign_to_field] = record[header.assign_to_field];
				console.log(set_data);

				fromStore.addField(set_data, record);
				editAssignData.value = null;
			}
		}
	};

	const confirmAssign = (data) => {
		let toStoreSetData = {};
		let fromStoreSetData = {};

		let toUpdateLogs = {};
		let fromUpdateLogs = {};

		toUpdateLogs = {
			type: "assign",
			sub_type: "add",
			field: header.field,
			to: assigningTo.value._id,
			updated_at: new Date(),
			updated_by: currentUser?.id,
		};

		fromUpdateLogs = {
			type: "assign",
			sub_type: "add",
			field: header.assign_to_field,
			to: data._id,
			updated_at: new Date(),
			updated_by: currentUser?.id,
		};

		if (header.store_assign_info === true) {
			const id_field = `${header.field}_ids`;

			let temp = {};
			temp.id = assigningTo.value._id;
			temp.assigned_on = new Date();
			temp.assigned_by = currentUser?.id;

			if (startDate) temp.start_date = new Date(start_date.value);
			if (endDate) temp.end_date = new Date(end_date.value);
			if (percentageAllocation)
				temp.percentage_allocation = percentage_allocation.value;

			if (!data[header.field]) {
				data[header.field] = [];
			}
			data[header.field].push(temp);

			if (!data[id_field]) {
				data[id_field] = [];
			}

			data[id_field].push(assigningTo.value._id.toString());

			if (!assigningTo.value[header.assign_to_field]) {
				assigningTo.value[header.assign_to_field] = [];
			}

			assigningTo.value[header.assign_to_field].push(data._id);

			toStoreSetData[header.field] = data[header.field];
			toStoreSetData[id_field] = data[id_field];

			fromStoreSetData[header.assign_to_field] =
				assigningTo.value[header.assign_to_field];
		} else {
			const id_field = `${header.assign_to_field}_ids`;

			let temp = {};
			temp.id = data._id;
			temp.assigned_on = new Date();
			temp.assigned_by = currentUser?.id;

			if (startDate) temp.start_date = new Date(start_date.value);
			if (endDate) temp.end_date = new Date(end_date.value);
			if (percentageAllocation)
				temp.percentage_allocation = percentage_allocation.value;

			if (!data[header.field]) {
				data[header.field] = [];
			}

			data[header.field].push(assigningTo.value._id);

			if (!assigningTo.value[header.assign_to_field]) {
				assigningTo.value[header.assign_to_field] = [];
			}
			assigningTo.value[header.assign_to_field].push(temp);

			if (!assigningTo.value[id_field]) {
				assigningTo.value[id_field] = [];
			}

			assigningTo.value[id_field].push(data._id.toString());

			fromStoreSetData[header.assign_to_field] =
				assigningTo.value[header.assign_to_field];
			fromStoreSetData[id_field] = assigningTo.value[id_field];

			toStoreSetData[header.field] = data[header.field];
		}

		bucket.value.set(assigningTo.value._id.toString(), assigningTo.value);

		if (!data.update_logs) {
			data.update_logs = [];
		}

		data.update_logs.push(toUpdateLogs);

		if (!assigningTo.value.update_logs) {
			assigningTo.value.update_logs = [];
		}

		assigningTo.value.update_logs.push(fromUpdateLogs);

		toStoreSetData.update_logs = data.update_logs;
		fromStoreSetData.update_logs = assigningTo.value.update_logs;

		console.log(data, assigningTo.value);

		toStore.addField(toStoreSetData, data);
		fromStore.addField(fromStoreSetData, assigningTo.value);

		isAdd.value = false;
	};

	const editAssignInit = (assignData, data) => {
		if (header.store_assign_info === true) {
			editAssignData.value = {};
			editAssignData.value.id = assignData.id.toString();
			editAssignData.value.start_date = formatHtmlDate(assignData.start_date);
			editAssignData.value.end_date = formatHtmlDate(assignData.end_date);
			editAssignData.value.percentage_allocation =
				assignData.percentage_allocation;
		} else if (header.store_assign_info === false) {
			const allocation = getRecordAllocation(assignData, data);
			editAssignData.value = {};
			editAssignData.value.record_id = assignData.toString();
			console.log(allocation);
			editAssignData.value.id = allocation.id.toString();
			editAssignData.value.start_date = formatHtmlDate(allocation.start_date);
			editAssignData.value.end_date = formatHtmlDate(allocation.end_date);
			editAssignData.value.percentage_allocation =
				allocation.percentage_allocation;
		}

		console.log(editAssignData.value);
	};
</script>

<style lang="scss" scoped></style>
