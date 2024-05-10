<script setup>
	import { ArrowsUpDownIcon } from "@heroicons/vue/24/outline";

	const { data, tableConfig } = defineProps(["data", "tableConfig"]);

	const emit = defineEmits(["sortData"]);

	const sortObject = ref({});

	onMounted(() => {
		// set the dropdown menu element
		const $targetElHide = document.getElementById("sortDropDownMenu");

		// set the element that trigger the dropdown menu on click
		const $triggerElHide = document.getElementById("sortDropDownBtn");

		// options with default values
		const options = {
			placement: "bottom",
			triggerType: "click",
			offsetSkidding: 0,
			offsetDistance: 10,
			delay: 300,
		};

		const sortDropDown = new Dropdown($targetElHide, $triggerElHide, options);
	});

	onBeforeMount(() => {
		tableConfig.headers.forEach((item) => {
			let field;
			if (item.parent) {
				field = `${item.parent}.${item.field}`;
			} else field = item.field;

			if (data?.hasOwnProperty(field))
				sortObject.value[item.field] = data[field];
			else sortObject.value[item.field] = 1;
		});
	});

	const sortHandler = (header) => {
		let field;
		let obj = {};

		if (header.parent) {
			field = `${header.parent}.${header.field}`;
		} else field = header.field;

		obj[field] = Number(sortObject.value[header.field]);

		emit("sortData", obj);
	};
</script>

<template>
	<button
		id="sortDropDownBtn"
		data-dropdown-toggle="sortDropDownMenu"
		class="focus:outline-none text-gray-500 font-medium rounded-lg text-sm px-3 py-2.5 text-center inline-flex items-center border border-gray-400 hover:bg-gray-400 hover:text-white"
		type="button">
		<ArrowsUpDownIcon class="w-5 h-5" />
	</button>
	<!-- Dropdown menu -->
	<div
		id="sortDropDownMenu"
		class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 w-60">
		<ul
			class="px-3 py-2 text-sm text-gray-700 dark:text-gray-200"
			aria-labelledby="sortDropDownBtn">
			<template v-for="(header, i) in tableConfig.headers" :key="i">
				<li
					v-if="header.is_visible && header.sort !== false"
					class="flex items-center gap-2">
					<span class="w-full py-2 text-start"> {{ header.name }} </span>
					<select
						@change="sortHandler(header)"
						v-if="header.type === 'text' || header.type === 'email'"
						v-model="sortObject[header.field]"
						class="block w-full px-2 py-1 text-xs text-gray-900 border border-gray-300 rounded-md bg-gray-50 focus:ring-gray-500 focus:border-gray-400">
						<option value="1" selected>A &rarr; Z</option>
						<option value="-1">Z &rarr; A</option>
					</select>
					<select
						@change="sortHandler(header)"
						v-if="header.type === 'tel' || header.type === 'number'"
						v-model="sortObject[header.field]"
						class="block w-full px-2 py-1 text-xs text-gray-900 border border-gray-300 rounded-md bg-gray-50 focus:ring-gray-500 focus:border-gray-400">
						<option value="1" selected>1 &rarr; 9</option>
						<option value="-1">9 &rarr; 1</option>
					</select>
					<select
						@change="sortHandler(header)"
						v-if="header.type === 'date'"
						v-model="sortObject[header.field]"
						class="block w-full px-2 py-1 text-xs text-gray-900 border border-gray-300 rounded-md bg-gray-50 focus:ring-gray-500 focus:border-gray-400">
						<option value="1" selected>1 &rarr; 9</option>
						<option value="-1">9 &rarr; 1</option>
					</select>
				</li>
			</template>
		</ul>
	</div>
</template>
