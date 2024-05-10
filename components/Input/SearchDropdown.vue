<template>
	<div class="relative">
		<input
			@click="toggleDropdown()"
			:name="`trigger-${elemId}`"
			:id="`trigger-${elemId}`"
			:required="required"
			type="text"
			placeholder="Search"
			v-model="searchString"
			class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-primary-600 focus:border-primary-600 block w-full py-1 px-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" />

		<div
			:id="elemId"
			class="z-40 hidden max-h-[300px] overflow-y-auto bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600 absolute translate-y-2">
			<ul
				v-if="searchString?.length >= 1"
				class="py-2 text-sm text-gray-700 dark:text-gray-200">
				<Spinner v-if="fetching" class="flex px-4 py-2 justify-center" />
				<div v-else>
					<li
						v-for="item in filteredSuggestions"
						:key="item"
						@click="dropdownSelect(item)">
						<p
							class="block px-3 py-1 hover:bg-gray-200 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer">
							{{ item }}
						</p>
					</li>
				</div>
			</ul>
		</div>
	</div>
</template>

<script setup>
	import { MagnifyingGlassIcon } from "@heroicons/vue/24/solid";

	const { suggestions, fieldValue, elemId, required } = defineProps([
		"suggestions",
		"fieldValue",
		"elemId",
		"required",
	]);

	const emit = defineEmits(["change"]);

	const fetching = ref(false);
	const searchString = ref(fieldValue);
	const filteredSuggestions = ref(suggestions);

	const toggleDropdown = () => {
		let button = document.getElementById(`trigger-${elemId}`);
		let dropdownElement = document.getElementById(elemId);

		dropdownElement.style.width = `${button.offsetWidth}px`;
		dropdownElement.classList.toggle("hidden");
	};

	onMounted(() => {
		document.addEventListener("click", (e) => {
			const element = e.target;
			let dropdownElement = document.getElementById(elemId);

			if (element?.id !== `trigger-${elemId}` && dropdownElement) {
				dropdownElement.classList.add("hidden");
			}
		});
	});

	watch(searchString, async (newVal, oldVal) => {
		fetching.value = true;

		filteredSuggestions.value = suggestions.filter((item) => {
			return item.toLowerCase().includes(newVal.toLowerCase());
		});

		fetching.value = false;

		emit("change", newVal);
	});

	const dropdownSelect = async (data) => {
		searchString.value = data;

		console.log(data);
		emit("change", data);
	};
</script>

<style lang="scss" scoped></style>
