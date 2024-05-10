<template>
	<!-- GROUP Dropdown -->
	<button
		id="groupDropDownBtn"
		data-dropdown-toggle="groupDropDownMenu"
		class="focus:outline-none text-gray-500 font-medium rounded-lg text-sm px-3 py-2.5 text-center inline-flex items-center border border-gray-400 hover:bg-gray-400 hover:text-white">
		<RectangleGroupIcon class="w-5 h-5" />
	</button>

	<!--GROUP Dropdown menu -->
	<div
		id="groupDropDownMenu"
		class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow px-2 w-28">
		<div
			v-if="grouped.active"
			class="text-sm px-2 pt-2 pb-1.5 text-gray-700 font-medium flex items-center justify-between">
			<p class="text-base font-bold">
				{{ grouped.groupedBy }}
			</p>
			<button
				type="button"
				@click="
					setGroup({
						active: false,
						groupedBy: null,
						header: null,
					})
				">
				<XMarkIcon class="w-4 h-4 mt-[.15rem] ml-1" />
			</button>
		</div>

		<ul
			class="flex flex-col items-start w-full py-2 text-sm text-gray-700 dark:text-gray-200"
			aria-labelledby="groupDropDownBtn">
			<template v-for="header in headers" :key="header.id">
				<li v-if="header.is_group" class="w-full">
					<button
						type="button"
						@click="
							setGroup({
								active: true,
								groupedBy: header.name,
								header: header,
							})
						"
						class="w-full flex items-start py-2 px-2 hover:bg-gray-100 rounded-md">
						{{ header.name }}
					</button>
				</li>
			</template>
		</ul>
	</div>
</template>

<script setup>
	import {
		RectangleGroupIcon,
		UserGroupIcon,
		XMarkIcon,
	} from "@heroicons/vue/24/outline";
	import { Dropdown } from "flowbite";

	const { groupComposable, headers } = defineProps([
		"groupComposable",
		"headers",
	]);

	const { grouped, setGroup } = groupComposable();

	onMounted(() => {
		// set the dropdown menu element
		const $targetElGroup = document.getElementById("groupDropDownMenu");

		// set the element that trigger the dropdown menu on click
		const $triggerElGroup = document.getElementById("groupDropDownBtn");

		// options with default values
		const options = {
			placement: "bottom",
			triggerType: "click",
			offsetSkidding: 0,
			offsetDistance: 10,
			delay: 300,
		};

		const groupDropdown = new Dropdown(
			$targetElGroup,
			$triggerElGroup,
			options
		);
		// initDropdowns()
	});
</script>
