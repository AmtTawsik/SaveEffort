<script setup>
	import { XMarkIcon, CheckIcon, PencilIcon } from "@heroicons/vue/24/outline";

	import { Dropdown } from "flowbite";

	const { currentUser } = useRealmApp();

	const { tableConfig, TABLE_DATA } = defineProps([
		"tableConfig",
		"TABLE_DATA",
	]);

	const store = tableConfig.store();
	const selectedRecords = store.selectedRecords;

	console.log(TABLE_DATA);

	const emit = defineEmits(["updateRecords"]);

	const editMultipleDropDown = ref(null);

	const selectedValue = ref({
		header: "Select a field",
		value: "",
	});

	onMounted(() => {
		createEditMultipleDropDown();
	});

	const createEditMultipleDropDown = () => {
		const targetEl = document.querySelector("#editMultipleDropDownMenu");
		const triggerEl = document.querySelector("#editMultipleDropDownBtn");

		const options = {
			placement: "bottom",
			triggerType: "click",
			offsetSkidding: 10,
			offsetDistance: 20,
			delay: 300,
		};

		editMultipleDropDown.value = new Dropdown(targetEl, triggerEl, options);
	};

	const resetHandler = () => {
		editMultipleDropDown.value.hide();
	};

	const updateHandler = () => {
		const header = selectedValue.value.header;
		const field = header.field;
		const set_data = {};
		const set_history = {};
		let update_logs = "update_logs";

		if (selectedValue.value.header?.type === "pipeline") {
			const value = +selectedValue.value.value;
			let current_stage = `${field}.current_stage`;
			let stages_date = `${field}.stages.${value}.date`;
			set_data[current_stage] = value;
			set_data[stages_date] = new Date();
			set_history[update_logs] = {
				sub_type: null,
				previous_stage_name: null,
				to: value,
				updated_at: new Date(),
				type: selectedValue.value.header?.type,
				field: header.field,
				updated_by: currentUser?.id,
				stage_name: header.stages[value],
			};
		} else if (selectedValue.value.header?.type === "date") {
			const value = selectedValue.value.value;
			set_data[field] = new Date(value);
			set_history[update_logs] = {
				fields: [
					{
						field: field,
						type: "changed",
						after: value,
					},
				],
				updated_at: new Date(),
				updated_by: currentUser?.id,
			};
		} else {
			const value = selectedValue.value.value;
			set_data[field] = value;
			set_history[update_logs] = {
				fields: [
					{
						field: field,
						type: "changed",
						after: value,
					},
				],
				updated_at: new Date(),
				updated_by: currentUser?.id,
			};
		}

		emit("updateRecords", { data: set_data, history: set_history });
		selectedValue.value = {
			header: null,
			value: "",
		};

		resetHandler();
	};
</script>

<template>
	<div>
		<button
			id="editMultipleDropDownBtn"
			data-dropdown-toggle="editMultipleDropDownMenu"
			class="focus:outline-none text-gray-500 font-medium rounded-lg text-sm px-3 py-2.5 text-center inline-flex items-center border border-gray-400 hover:bg-gray-400 hover:text-white">
			<PencilIcon class="w-5 h-5" />
		</button>

		<div
			id="editMultipleDropDownMenu"
			class="z-10 hidden p-3 bg-white divide-y divide-gray-100 rounded-md shadow">
			<div class="grid grid-cols-1 gap-4">
				<ul
					class="grid grid-cols-2 items-center gap-2 text-sm text-gray-700 max-lg:flex-col max-lg:items-start"
					aria-labelledby="editMultipleDropDownBtn">
					<li class="flex flex-col gap-2">
						<label>Fields:</label>
						<select
							v-model="selectedValue.header"
							class="bg-gray-50 border border-gray-300 text-gray-800 text-sm focus:ring-green-400 focus:border-transparent rounded-md block w-full px-2 py-1 max-lg:w-full">
							<option disabled selected hidden value="Select a field">
								Select a field
							</option>
							<template v-for="header in tableConfig.headers" :key="header">
								<option v-if="header.selectedValue !== false" :value="header">
									{{ header.name }}
								</option>
							</template>
						</select>
					</li>

					<li class="flex flex-col gap-2">
						<label
							v-if="
								selectedValue.header &&
								selectedValue.header !== 'Select a field'
							"
							>Value:</label
						>
						<select
							v-if="
								selectedValue.header?.dropdown === true &&
								selectedValue.header?.options?.length > 0
							"
							v-model="selectedValue.value"
							class="bg-gray-50 border border-gray-300 text-gray-800 text-sm focus:ring-green-400 focus:border-transparent rounded-md block w-full py-1 max-lg:w-full">
							<option
								v-for="(option, index) in selectedValue.header.options"
								:key="index"
								:value="option.value">
								{{ option.name }}
							</option>
						</select>

						<input
							v-else-if="
								selectedValue.header?.type === 'text' ||
								selectedValue.header?.type === 'email'
							"
							:type="selectedValue.header?.type"
							v-model="selectedValue.value"
							class="bg-gray-50 border border-gray-300 text-gray-800 text-sm focus:ring-green-400 focus:border-transparent rounded-md block px-2 py-1 w-full"
							required />

						<input
							v-else-if="
								selectedValue.header?.type === 'tel' ||
								selectedValue.header?.type === 'number'
							"
							:type="selectedValue.header?.type"
							v-model="selectedValue.value"
							class="bg-gray-50 border border-gray-300 text-gray-800 text-sm focus:ring-green-400 focus:border-transparent rounded-md block px-2 py-1 w-full"
							required />

						<input
							v-else-if="selectedValue.header?.type === 'date'"
							:type="selectedValue.header?.type"
							v-model="selectedValue.value"
							class="bg-gray-50 border border-gray-300 text-gray-800 text-sm focus:ring-green-400 focus:border-transparent rounded-md block px-2 py-1 w-full"
							required />

						<select
							v-else-if="selectedValue.header?.type === 'pipeline'"
							v-model="selectedValue.value"
							class="bg-gray-50 border border-gray-300 text-gray-800 text-sm focus:ring-green-400 focus:border-transparent rounded-md block px-2 py-1 w-full max-lg:w-full">
							<option
								v-for="(stage, index) in selectedValue.header.stages"
								:key="index"
								:value="index">
								{{ stage }}
							</option>
						</select>
					</li>
				</ul>
				<div class="flex gap-2 w-full">
					<button
						@click="updateHandler()"
						class="primary-button-sm flex-1 w-full">
						<CheckIcon class="w-4 h-4" />
						Update
					</button>
					<button
						@click="resetHandler()"
						class="secondary-button-sm flex-1 w-full">
						<XMarkIcon class="w-4 h-4" />
						Cancel
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
