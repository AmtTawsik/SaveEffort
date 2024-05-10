<template>
	<div class="relative">
		<div class="relative">
			<div
				class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
				<MagnifyingGlassIcon class="w-5 h-5" />
			</div>
			<input
				@click="toggleDropdown()"
				v-model="postCode"
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
			<ul
				v-if="postCode?.length >= 2"
				class="py-2 text-sm text-gray-700 dark:text-gray-200">
				<Spinner v-if="fetching" class="flex px-4 py-2 justify-center" />
				<div v-else>
					<li
						v-for="addr in addressArray"
						:key="addr.id"
						@click="dropdownSelect($event, addr)">
						<p
							class="block px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer">
							{{ addr.address }}
						</p>
					</li>
				</div>
			</ul>
		</div>
	</div>
</template>

<script setup>
	import { MagnifyingGlassIcon } from "@heroicons/vue/24/solid";

	const { header, fieldValue, prefix, required } = defineProps([
		"header",
		"fieldValue",
		"prefix",
		"required",
	]);
	const { currentUser } = useRealmApp();
	const { getAddressSuggestions } = useAddressApi();
	const emit = defineEmits(["change"]);

	const dropdown = ref();
	const fetching = ref(false);
	const postCode = ref(null);
	const selectedAddress = ref(null);
	const addressArray = ref(null);
	const topHit = ref(null);

	if (fieldValue) {
		selectedAddress.value = fieldValue;
		postCode.value = fieldValue.address;
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
					element?.id?.includes(`option-${header.name}`)) &&
				dropdownElement
			) {
				dropdownElement.classList.add("hidden");
			}
		});
	});

	watch(postCode, async (newVal, oldVal) => {
		if (selectedAddress.value && newVal === selectedAddress.value.address)
			return;
		else if (!newVal) {
			return;
		} else if (newVal.length >= 2) {
			fetching.value = true;
			let result = await getAddressSuggestions(newVal);
			if (result === null || result.suggestions.length === 0) {
				fetching.value = false;
				return;
			}
			console.log(result);
			addressArray.value = result.suggestions;
			// console.log(addressArray.value);
			fetching.value = false;
		}
	});

	const dropdownSelect = (event, data) => {
		postCode.value = data.address;
		selectedAddress.value = data;
		emit("change", data);
	};
</script>

<style lang="scss" scoped></style>
