<template>
	<div v-if="data" class="w-full">
		<label
			for="people_name"
			class="block mb-2 text-base font-medium text-gray-900 dark:text-white"
			>{{ label }}</label
		>
		<select
			@change="emit('change', selectedValue)"
			v-model="selectedValue"
			id="people_name"
			class="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 max-w-xs"
			required>
			<option value="" disabled>Select people</option>
			<option v-for="(record, index) in data" :key="index" :value="record">
				{{ record[field] }}
			</option>
		</select>
	</div>
</template>

<script setup>
	const { data, field, label } = defineProps(["data", "field", "label"]);
	const emit = defineEmits(["change"]);
	const selectedValue = ref("");
</script>

<style lang="scss" scoped></style>
