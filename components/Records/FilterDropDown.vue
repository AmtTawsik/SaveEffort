<script setup>
	import {
		FunnelIcon,
		PlusIcon,
		AdjustmentsHorizontalIcon,
	} from "@heroicons/vue/24/outline";
	import { XMarkIcon, TrashIcon } from "@heroicons/vue/24/solid";
	import { Dropdown } from "flowbite";

	const { data, tableConfig } = defineProps(["data", "tableConfig"]);

	const emit = defineEmits(["filterData"]);

	const filterDropdown = ref(null);

	const filters = ref([
		{
			selectHeader: null,
			operator: "",
			operand: "",
		},
	]);

	onBeforeMount(() => {
		if (data) {
			filters.value = data;
		}
	});

	onMounted(() => {
		createFilterDropdown();
	});

	const createFilterDropdown = () => {
		const targetEl = document.querySelector("#filterDropDownMenu");
		const triggerEl = document.querySelector("#filterDropDownBtn");

		const options = {
			placement: "bottom",
			triggerType: "click",
			offsetSkidding: 20,
			offsetDistance: 20,
			delay: 300,
		};

		filterDropdown.value = new Dropdown(targetEl, triggerEl, options);
	};

	const lastFilterValue = computed(() =>
		filters.value[filters.value.length - 1].operand.toString().trim()
	);

	const filterHandler = (closeDropdown) => {
		if (closeDropdown) {
			filterDropdown.value.hide();
		}

		const filtersValue = filters.value
			.filter((filter) => filter.operand.toString().trim() !== "")
			.map((el) => {
				if (Array.isArray(el.operand)) {
					return el;
				}

				let newOperand = el.operand;

				if (el.operator === "$in" || el.operator === "$nin") {
					newOperand = el.operand.includes(",")
						? el.operand
								.toString()
								.trim()
								.split(",")
								?.map((item) => (item = item.trim()))
						: [el.operand];
				}

				return { ...el, operand: newOperand };
			});

		if (
			filtersValue.length === 0 ||
			filtersValue.some((value) => value.operator === "")
		) {
			return;
		}

		emit("filterData", filtersValue);
		createFilterDropdown();
	};

	const addEmptyFilter = () => {
		if (lastFilterValue.value === "") return;
		filters.value.push({
			selectHeader: null,
			operator: "",
			operand: "",
		});
	};

	const resetHandler = () => {
		const initalValue = [
			{
				selectHeader: null,
				operator: "",
				operand: "",
			},
		];

		if (filters.value.length <= 1 && lastFilterValue.value === "") {
			filters.value = initalValue;
			return;
		}

		filterDropdown.value.hide();
		filters.value = initalValue;

		emit("filterData", null);
	};

	const deleteFilter = (index) => {
		const [deletedFilter] = filters.value.splice(index, 1);
		if (deletedFilter.operand.toString().trim() !== "") filterHandler();
		if (filters.value.length < 2 && lastFilterValue.value === "")
			resetHandler();
	};
</script>

<template>
	<div>
		<button
			id="filterDropDownBtn"
			data-dropdown-toggle="filterDropDownMenu"
			class="focus:outline-none text-gray-500 font-medium rounded-lg text-sm px-3 py-2.5 text-center inline-flex items-center border border-gray-400 hover:bg-gray-400 hover:text-white">
			<FunnelIcon class="w-5 h-5" />
		</button>

		<div
			id="filterDropDownMenu"
			class="z-10 hidden p-3 bg-white divide-y divide-gray-100 rounded-md shadow">
			<form @submit.prevent="filterHandler(true)" class="flex flex-col gap-2">
				<ul
					v-for="(filter, index) in filters"
					:key="index"
					class="flex items-center gap-1 text-sm text-gray-700 max-lg:flex-col max-lg:items-start"
					aria-labelledby="filterDropDownBtn">
					<li class="mr-1 max-lg:hidden">
						<p>Where</p>
					</li>
					<li>
						<select
							@change="filter.operand = ''"
							v-model="filter.selectHeader"
							class="bg-gray-50 border border-gray-300 text-gray-800 text-sm focus:ring-green-400 focus:border-transparent rounded-md block w-full px-2 py-1 max-lg:w-full"
							required>
							<option disabled selected hidden :value="null">
								Select a field
							</option>
							<template v-for="header in tableConfig.headers" :key="header">
								<option v-if="header.filter !== false" :value="header">
									{{ header.name }}
								</option>
							</template>
						</select>
					</li>

					<li>
						<select
							v-if="
								filter.selectHeader?.is_assign_dropdown === true ||
								filter.selectHeader?.type === 'pipeline'
							"
							v-model="filter.operator"
							class="bg-gray-50 border border-gray-300 text-gray-800 text-sm focus:ring-green-400 focus:border-transparent rounded-md block w-full py-1 max-lg:w-full"
							required>
							<option disabled selected hidden value="">operator</option>
							<option value="$eq">is...</option>
							<option value="$ne">is not...</option>
						</select>

						<select
							v-else-if="filter.selectHeader?.type === 'number'"
							v-model="filter.operator"
							class="bg-gray-50 border border-gray-300 text-gray-800 text-sm focus:ring-green-400 focus:border-transparent rounded-md block w-full py-1 max-lg:w-full"
							required>
							<option disabled selected hidden value="">operator</option>
							<option value="$eq">&#x208C;</option>
							<option value="$ne">&#x2260;</option>
							<option value="$lt">&lt;</option>
							<option value="$gt">&gt;</option>
							<option value="$lte">&le;</option>
							<option value="$gte">&ge;</option>
						</select>

						<select
							v-else-if="filter.selectHeader?.type === 'date'"
							v-model="filter.operator"
							class="bg-gray-50 border border-gray-300 text-gray-800 text-sm focus:ring-green-400 focus:border-transparent rounded-md block w-full py-1 max-lg:w-full"
							required>
							<option disabled selected hidden value="">operator</option>
							<option value="$eq">is...</option>
							<option value="$lt">is before...</option>
							<option value="$gt">is after...</option>
							<option value="$lte">is on or before...</option>
							<option value="$gte">is on or after...</option>
						</select>

						<select
							v-else
							v-model="filter.operator"
							class="bg-gray-50 border border-gray-300 text-gray-800 text-sm focus:ring-green-400 focus:border-transparent rounded-md block w-full py-1 max-lg:w-full"
							required>
							<option disabled selected hidden value="">operator</option>
							<option value="$in">is...</option>
							<option value="$nin">is not...</option>
						</select>
					</li>

					<li class="flex-1">
						<InputMultiSelectDropdown
							v-if="
								(filter.selectHeader?.dropdown === true ||
									filter.selectHeader?.multi_select_dropdown === true ||
									filter.selectHeader?.auto_complete) &&
								filter.selectHeader?.options?.length > 0
							"
							@change="filter.operand = $event"
							:key="filter.selectHeader.name"
							:header="filter.selectHeader"
							:fieldValue="filter.operand"
							:required="true"
							prefix="filter" />

						<select
							v-else-if="filter.selectHeader?.type === 'pipeline'"
							v-model="filter.operand"
							class="bg-gray-50 border border-gray-300 text-gray-800 text-sm focus:ring-green-400 focus:border-transparent rounded-md block w-full py-1 max-lg:w-full"
							required>
							<option
								v-for="(stage, index) in filter.selectHeader.stages"
								:key="index"
								:value="index">
								{{ stage }}
							</option>
						</select>

						<input
							v-else
							:type="filter.selectHeader?.type"
							v-model="filter.operand"
							class="bg-gray-50 border border-gray-300 text-gray-800 text-sm focus:ring-green-400 focus:border-transparent rounded-md block px-2 py-1 w-full max-lg:w-full"
							required />
					</li>
					<li v-if="filters.length > 1">
						<button
							type="button"
							@click="deleteFilter(index)"
							class="p-2 text-red-600 bg-white border border-red-300 rounded-full hover:bg-red-600 hover:text-white">
							<TrashIcon class="w-4 h-4 font-semibold" />
						</button>
					</li>
				</ul>
				<button
					type="button"
					@click="addEmptyFilter()"
					class="p-1 bg-green-400 hover:bg-green-500 border-gray-300 rounded-full text-base text-white font-semibold w-fit self-center">
					<PlusIcon class="w-5 h-5" />
				</button>
				<div class="flex gap-2 w-full max-lg:flex-col">
					<button class="primary-button-sm flex-1">
						<AdjustmentsHorizontalIcon class="w-4 h-4" />
						Filter
					</button>
					<button
						type="reset"
						@click="resetHandler()"
						class="secondary-button-sm flex-1">
						<XMarkIcon class="w-4 h-4" />
						Reset
					</button>
				</div>
			</form>
		</div>
	</div>
</template>
