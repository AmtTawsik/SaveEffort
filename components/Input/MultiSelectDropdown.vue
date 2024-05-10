<template>
	<div class="relative">
		<div
			class="relative"
			:id="`multi-dropdown-button-${prefix}-${header.name}`">
			<input
				@keypress.enter="addOption"
				:readonly="dropdownIsHidden"
				:id="`multi-dropdown-input-${prefix}-${header.name}`"
				:name="`${prefix}-${header.name}`"
				:placeholder="`Search ${header.name}`"
				:required="required"
				:title="searchInput"
				v-model="searchInput"
				type="text"
				class="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full pr-8 p-2.5 cursor-text" />

			<ChevronDownIcon
				class="w-5 h-5 absolute top-1/2 right-2 -translate-y-1/2 text-gray-600 cursor-pointer" />
		</div>

		<div
			:id="`multi-dropdown-${prefix}-${header.name}`"
			:class="`${
				dropdownIsHidden ? 'hidden' : ''
			} z-40 max-h-[300px] overflow-y-auto bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600 absolute translate-y-2`">
			<ul
				:id="`multi-dropdown-list-${prefix}-${header.name}`"
				v-if="header.options"
				class="px-2 py-3 text-sm text-gray-700">
				<li v-if="selectedOptions?.length > 0" class="p-1 font-semibold">
					{{ getOptionName() }}
				</li>
				<template v-if="filterOptions()?.length > 0">
					<li v-for="(opt, index) in filterOptions()" :key="opt.value">
						<div
							:id="`multi-option-holder-${prefix}-${header.name}-${index}`"
							class="flex px-2.5 py-0.5 rounded hover:bg-gray-100"
							@click="captureOptIndex(index)">
							<input
								:id="`multi-option-${prefix}-${header.name}-${index}`"
								:name="`multi-option-${prefix}-${header.name}-${index}`"
								type="checkbox"
								:value="opt.value"
								v-model="selectedOptions"
								class="p-1 self-center w-4 h-4 text-green-400 rounded-sm bg-gray-100 border-gray-300 focus:ring-white focus:ring-0 cursor-pointer" />

							<label
								:for="`multi-option-${prefix}-${header.name}-${index}`"
								class="flex gap-2 items-center p-2 text-sm w-full cursor-pointer">
								<span class="text-gray-900">
									{{ opt.name }}
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
	import { ChevronDownIcon } from "@heroicons/vue/24/solid";

	const emit = defineEmits(["change"]);

	const { header, fieldValue, prefix, required } = defineProps([
		"header",
		"fieldValue",
		"prefix",
		"required",
	]);

	const selectedValue = ref("");
	const searchInput = ref("");
	const selectedOptions = ref([]);
	const dropDownIndex = ref(null);
	const dropdownIsHidden = ref(true);
	const isEventSet = ref(false);

	const getOptionName = () => {
		const optionName = __getOptionName(header.options, selectedOptions.value);

		return optionName.join(", ");
	};

	const __getOptionName = (options, val) => {
		return val.map((value) => {
			const option = options.find((opt) => opt.value === value);
			return option ? option.name : value;
		});
	};

	if (fieldValue) {
		let __fieldValue;

		if (!Array.isArray(fieldValue)) __fieldValue = [fieldValue];
		else __fieldValue = fieldValue;

		selectedOptions.value = __fieldValue;
		searchInput.value = getOptionName();
	}

	const addOption = () => {
		if (searchInput.value.length < 2) return;
		selectedOptions.value.push(searchInput.value);

		let exists = header.options.some(
			(item) => item.value === searchInput.value
		);

		if (!exists) {
			header.options.unshift({
				name: searchInput.value,
				value: searchInput.value,
			});
		}

		searchInput.value = "";
	};

	const captureOptIndex = (index) => {
		dropDownIndex.value = index;
	};

	const filterOptions = () => {
		return header.options.filter((item) => {
			return item.value.toLowerCase().includes(searchInput.value.toLowerCase());
		});
	};

	watch(dropdownIsHidden, (newVal) => {
		if (newVal) {
			searchInput.value = getOptionName();
		} else searchInput.value = "";
	});

	watch(selectedOptions, (newVal, oldVal) => {
		searchInput.value = "";
		emit("change", selectedOptions.value);
	});

	onMounted(() => {
		if (isEventSet.value === false) {
			document.addEventListener("click", (e) => {
				let clickedElement = e.target;
				let button = document.getElementById(
					`multi-dropdown-button-${prefix}-${header.name}`
				);
				let dropdownElement = document.getElementById(
					`multi-dropdown-${prefix}-${header.name}`
				);
				let inputElement = document.getElementById(
					`multi-dropdown-input-${prefix}-${header.name}`
				);

				while (clickedElement && !clickedElement.id) {
					clickedElement = clickedElement.parentNode;
				}

				if (!clickedElement || !clickedElement.id) return;

				if (
					clickedElement.id ===
						`multi-dropdown-button-${prefix}-${header.name}` ||
					clickedElement.id === `multi-dropdown-input-${prefix}-${header.name}`
				) {
					dropdownElement.style.width = `${button.offsetWidth}px`;
					dropdownIsHidden.value = dropdownIsHidden.value ? false : false;
					inputElement.focus();
				} else if (
					clickedElement.id ===
						`multi-option-holder-${prefix}-${header.name}-${dropDownIndex.value}` ||
					clickedElement.id ===
						`multi-option-${prefix}-${header.name}-${dropDownIndex.value}` ||
					clickedElement.id === `multi-dropdown-list-${prefix}-${header.name}`
				) {
					dropdownIsHidden.value = false;
				} else if (dropdownElement) {
					dropdownIsHidden.value = true;
				}
			});
			isEventSet.value = true;
		}
	});
</script>
