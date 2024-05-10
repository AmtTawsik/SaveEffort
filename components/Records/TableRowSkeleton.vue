<template>
	<td class="w-4 p-4 rounded-tl-md" scope="row">
		<div class="flex items-center">
			<input
				id="checkbox-table-row-skeleton"
				type="checkbox"
				class="w-5 h-5 text-green-400 rounded-md bg-gray-100 border-gray-300 focus:ring-white focus:ring-0" />
			<label for="checkbox-table-row-skeleton" class="sr-only">checkbox</label>
		</div>
	</td>
	<template v-for="(value, key) in tableTdVisible" :key="key">
		<td v-if="value" class="px-3 py-4 whitespace-nowrap">
			<div class="flex items-center justify-between animate-pulse">
				<div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24"></div>
			</div>
		</td>
	</template>

	<td class="px-3 py-4 rounded-tr-md"></td>
</template>

<script setup>
	const { hideComposable } = defineProps(["hideComposable"]);
	const { tableTdVisible } = hideComposable();
</script>

<style lang="scss" scoped></style>
