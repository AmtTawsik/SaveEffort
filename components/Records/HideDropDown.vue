<script setup>
	import { Dropdown } from "flowbite";
	import { EyeIcon } from "@heroicons/vue/24/outline";

	const { headers, tabHeaders, hideComposable } = defineProps([
		"headers",
		"tabHeaders",
		"hideComposable",
	]);

	const { tableTdVisible, showAllTableTd, hideAllTableTd } = hideComposable();

	onMounted(() => {
		// set the dropdown menu element
		const $targetElHide = document.getElementById("hideDropdownMenu");

		// set the element that trigger the dropdown menu on click
		const $triggerElHide = document.getElementById("hideDropdownBtn");

		// options with default values
		const options = {
			placement: "bottom",
			triggerType: "click",
			offsetSkidding: 0,
			offsetDistance: 10,
			delay: 300,
		};

		const hideDropdown = new Dropdown($targetElHide, $triggerElHide, options);
	});
</script>

<template>
	<div>
		<!-- HIDE Dropdown -->
		<button
			id="hideDropdownBtn"
			data-dropdown-toggle="hideDropdownMenu"
			class="focus:outline-none text-gray-500 font-medium rounded-lg text-sm px-3 py-2.5 text-center inline-flex items-center border border-gray-400 hover:bg-gray-400 hover:text-white"
			type="button">
			<EyeIcon class="w-5 h-5" />
		</button>

		<!-- HIDE Dropdown menu -->
		<div
			id="hideDropdownMenu"
			class="z-10 hidden bg-white divide-y divide-gray-100 rounded-md shadow dark:bg-gray-700 dark:divide-gray-600 max-h-96 overflow-auto">
			<ul
				class="pl-2 py-2 pr-3 space-y-1 text-sm text-gray-700 dark:text-gray-200"
				aria-labelledby="hideDropdownBtn">
				<h1 class="p-2 font-semibold">Table fields</h1>
				<li v-for="(header, key) in tableTdVisible" :key="key">
					<div
						class="flex p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
						<label
							class="relative inline-flex items-center w-full cursor-pointer">
							<input
								type="checkbox"
								v-model="tableTdVisible[key]"
								class="sr-only peer" />
							<div
								class="w-9 h-5 bg-red-400 peer-focus:outline-none dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-500 peer-checked:bg-green-400"></div>
							<span class="ml-3 text-sm dark:text-gray-300"> {{ key }}</span>
						</label>
					</div>
				</li>
			</ul>
			<div class="flex gap-1 justify-between text-gray-600 px-2 py-3 text-xs">
				<button
					@click="hideAllTableTd"
					class="bg-gray-100 px-3 py-1 rounded-sm hover:bg-gray-200">
					Hide All
				</button>
				<button
					@click="showAllTableTd"
					class="bg-gray-100 px-3 py-1 rounded-sm hover:bg-gray-200">
					Show All
				</button>
			</div>
		</div>
	</div>
</template>
