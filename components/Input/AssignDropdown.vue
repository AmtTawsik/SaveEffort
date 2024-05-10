<template>
	<div class="relative">
		<div class="relative">
			<div
				class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
				<MagnifyingGlassIcon class="w-5 h-5" />
			</div>
			<input
				@click="toggleDropdown()"
				v-model="searchString"
				type="text"
				:name="`${prefix}-${header.name}`"
				:id="`dropdown-button-${prefix}-${header.name}`"
				class="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full pl-12 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
				:placeholder="`Search ${header.name}`"
				:required="required" />
		</div>

		<div
			:id="`dropdown-${prefix}-${header.name}`"
			class="z-40 hidden max-h-[300px] overflow-y-auto bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600 absolute translate-y-2">
			<ul class="p-3 text-sm text-gray-700 dark:text-gray-200">
				<template v-if="options?.length > 0">
					<li v-for="(opt, index) in options" :key="opt">
						<div class="flex rounded hover:bg-gray-100 dark:hover:bg-gray-600">
							<div class="flex items-center p-1">
								<input
									v-if="header.multi_select"
									:id="`option-${prefix}-${header.name}-${index}`"
									:name="`option-${prefix}-${header.name}-${index}`"
									type="checkbox"
									:value="opt"
									v-model="multiSelectValue"
									class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 cursor-pointer" />
								<input
									v-else
									@click="toggleDropdown()"
									:id="`option-${prefix}-${header.name}-${index}`"
									:name="`option-${prefix}-${header.name}-${index}`"
									type="radio"
									:value="opt"
									v-model="selectedValue"
									class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 cursor-pointer" />
							</div>
							<label
								:for="`option-${prefix}-${header.name}-${index}`"
								class="flex gap-2 items-center p-2 text-sm w-full">
								<img
									v-if="
										header.get_from_field_image &&
										opt[header.get_from_field_image]
									"
									class="w-6 h-6 rounded-full cursor-pointer"
									:src="opt[header.get_from_field_image]"
									alt="User image" />
								<img
									v-else
									class="w-6 h-6 rounded-full cursor-pointer"
									src="~/assets/images/default-user.png"
									alt="Default user image" />
								<span
									v-if="header.multi_select"
									class="text-gray-900 dark:text-gray-300 cursor-pointer">
									{{ opt[header.get_from_field] }}
								</span>
								<span
									v-else
									class="text-gray-900 dark:text-gray-300 cursor-pointer">
									{{ opt[header.get_from_field] }}
								</span>
							</label>
						</div>
					</li>
				</template>
				<div v-else class="p-2">
					<p>No results found</p>
				</div>
			</ul>
		</div>
	</div>
</template>

<script setup>
	import { MagnifyingGlassIcon } from "@heroicons/vue/24/solid";

	const globalStore = useGlobalStore();
	const emit = defineEmits(["change"]);

	const { header, fieldValue, prefix, required } = defineProps([
		"header",
		"fieldValue",
		"prefix",
		"required",
	]);

	const store = globalStore[header.get_from]?.useStore();
	const isFetching = ref(false);
	const searchString = ref(null);
	const selectedValue = ref(null);
	const multiSelectValue = ref([]);
	const options = useState(`assignDropdown${header?.name}`, () => []);

	if (fieldValue) {
		const temp = await store.findById(fieldValue);

		if (temp) {
			searchString.value = temp[header.get_from_field];
			options.value = [temp];
			selectedValue.value = temp;
		}
	} else {
		searchString.value = null;
		selectedValue.value = null;
		options.value = await store.initRecordsData();
	}

	const toggleDropdown = () => {
		let button = document.getElementById(
			`dropdown-button-${prefix}-${header.name}`
		);
		let dropdownElement = document.getElementById(
			`dropdown-${prefix}-${header.name}`
		);

		dropdownElement.style.width = `${button.offsetWidth}px`;
		dropdownElement.classList.toggle("hidden");
	};

	onMounted(() => {
		document.addEventListener("click", (e) => {
			const element = e.target;
			let dropdownElement = document.getElementById(
				`dropdown-${prefix}-${header.name}`
			);

			if (
				(element?.id !== `dropdown-button-${prefix}-${header.name}` ||
					element?.id?.includes(`option-${prefix}-${header.name}`)) &&
				dropdownElement
			) {
				dropdownElement.classList.add("hidden");
			}
		});
	});

	watch(searchString, async (newVal, oldVal) => {
		if (fieldValue && !oldVal) {
			isFetching.value = false;

			return;
		}

		if (newVal === "") {
			options.value = store.recordsData;
			isFetching.value = false;

			return;
		}

		if (newVal === oldVal || newVal?.length === 0) {
			options.value = store.recordsData;
			isFetching.value = false;

			return;
		}

		if (header) {
			let temp = {};

			isFetching.value = true;

			temp[header.get_from_field] = {};
			temp[header.get_from_field]["$regex"] = newVal;
			temp[header.get_from_field]["$options"] = "i";

			store.findRecords([temp]).then((res) => {
				if (isFetching.value) {
					options.value = res;
					isFetching.value = false;
				}
			});

			return;
		}
	});

	watch(selectedValue, (newVal, oldVal) => {
		if (fieldValue && !oldVal) return;

		if (oldVal !== newVal && newVal) {
			searchString.value = newVal[header.get_from_field];
			emit("change", newVal[header.get_from_value]);
		}
	});

	watch(multiSelectValue, (newVal, oldVal) => {
		if (fieldValue && !oldVal) return;

		if (oldVal !== newVal && newVal) {
			selectedValue.value = multiSelectValue.value;
		}
	});
</script>

<style lang="scss" scoped></style>
