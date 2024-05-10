<template>
	<div class="relative">
		<div
			class="relative"
			:id="`single-dropdown-button-${prefix}-${header.name}`">
			<input
				v-model="selectedValue"
				readonly
				type="text"
				:id="`single-dropdown-input-${prefix}-${header.name}`"
				:name="`${prefix}-${header.name}`"
				class="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full pl-3 p-2.5 cursor-pointer"
				:placeholder="`Select ${header.name}`"
				:required="required" />

			<ChevronDownIcon
				class="w-5 h-5 absolute top-1/2 right-3 -translate-y-1/2 text-gray-600 cursor-pointer" />
		</div>

		<div
			:id="`single-dropdown-${prefix}-${header.name}`"
			:class="`${
				dropdownIsHidden ? 'hidden' : ''
			} z-40 max-h-[300px] overflow-y-auto bg-white divide-y divide-gray-100 rounded-lg shadow absolute translate-y-2`">
			<ul v-if="header.options" class="px-2 py-3 text-sm text-gray-700">
				<li v-if="header.custom_input" class="pl-1 my-1">
					<input
						:id="`custom-input-${prefix}-${header.name}`"
						class="w-full px-3 py-1 bg-gray-50 border border-gray-300 text-gray-900 text-[.9rem] rounded-lg focus:ring-primary-600 focus:border-primary-600"
						placeholder="Type a custom value"
						v-model="customInput"
						type="text" />
				</li>
				<template v-if="header.options?.length > 0">
					<li v-for="(opt, index) in header.options" :key="opt.value">
						<div class="flex px-2.5 py-0.5 rounded hover:bg-gray-100">
							<input
								:id="`single-option-${prefix}-${header.name}-${index}`"
								:name="`single-option-${prefix}-${header.name}-${index}`"
								type="radio"
								:value="opt.value"
								v-model="options"
								class="p-1 self-center w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-white focus:ring-0 cursor-pointer" />

							<label
								:for="`single-option-${prefix}-${header.name}-${index}`"
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

	const selectedValue = ref(null);
	const customInput = ref("");
	const options = ref(null);
	const dropdownIsHidden = ref(true);

	const getCurrOption = (options, val) => {
		return options.find((opt) => opt.value === val);
	};

	if (fieldValue) {
		const currOption = getCurrOption(header.options, fieldValue);
		if (currOption) {
			selectedValue.value = currOption.name;
			options.value = fieldValue;
		} else {
			selectedValue.value = fieldValue;
			customInput.value = fieldValue;
		}
	}

	watch(customInput, (newVal) => {
		selectedValue.value = newVal;
		emit("change", customInput.value);
	});

	watch(options, (newVal) => {
		const currOption = getCurrOption(header.options, newVal);
		selectedValue.value = currOption.name;
		emit("change", options.value);
	});

	onMounted(() => {
		document.addEventListener("click", (e) => {
			let clickedElement = e.target;
			let button = document.getElementById(
				`single-dropdown-button-${prefix}-${header.name}`
			);
			let dropdownElement = document.getElementById(
				`single-dropdown-${prefix}-${header.name}`
			);
			let inputElement = document.getElementById(
				`single-dropdown-input-${prefix}-${header.name}`
			);

			while (clickedElement && !clickedElement.id) {
				clickedElement = clickedElement.parentNode;
			}

			if (!clickedElement || !clickedElement.id) return;

			if (
				clickedElement.id ===
					`single-dropdown-button-${prefix}-${header.name}` ||
				clickedElement.id === `single-dropdown-input-${prefix}-${header.name}`
			) {
				dropdownElement.style.width = `${button.offsetWidth}px`;
				dropdownIsHidden.value = !dropdownIsHidden.value;
				inputElement.focus();
			} else if (
				clickedElement.id === `custom-input-${prefix}-${header.name}`
			) {
				dropdownIsHidden.value = false;
			} else if (
				clickedElement?.id !==
					`single-dropdown-button-${prefix}-${header.name}` ||
				(clickedElement?.id?.includes(
					`single-option-${prefix}-${header.name}`
				) &&
					dropdownElement)
			) {
				dropdownIsHidden.value = true;
			}
		});
	});
</script>
