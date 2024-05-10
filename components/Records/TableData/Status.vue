<template>
	<div
		v-if="
			content?.toLowerCase() === 'active' ||
			content?.toLowerCase() === 'completed'
		"
		class="px-3 py-4">
		<p
			class="flex justify-center items-center bg-green-100 text-green-500 text-sm font-semibold px-3 py-2 rounded-full dark:bg-green-900 dark:text-green-300 w-fit">
			{{ content }}
		</p>
	</div>
	<div v-else-if="content?.toLowerCase() === 'inactive'" class="px-3 py-4">
		<p
			class="flex justify-center items-center bg-red-100 text-red-500 text-sm font-semibold px-3 py-2 rounded-full dark:bg-red-900 dark:text-red-100 w-fit">
			{{ content }}
		</p>
	</div>
	<div
		v-else-if="
			content?.toLowerCase() === 'allumini' ||
			content?.toLowerCase() === 'in progress'
		"
		class="px-3 py-4">
		<p
			class="flex justify-center items-center bg-blue-100 text-blue-500 text-sm font-semibold px-3 py-2 rounded-full dark:bg-blue-900 dark:text-blue-100 w-fit">
			{{ content }}
		</p>
	</div>
	<div v-else-if="content?.toLowerCase() === 'planning'" class="px-3 py-4">
		<p
			class="flex justify-center items-center bg-yellow-100 text-yellow-500 text-sm font-semibold px-3 py-2 rounded-full dark:bg-yellow-900 dark:text-yellow-300 w-fit">
			{{ content }}
		</p>
	</div>
	<div v-else-if="content?.toLowerCase() === 'on hold'" class="px-3 py-4">
		<p
			class="flex justify-center items-center bg-purple-100 text-purple-500 text-sm font-semibold px-3 py-2 rounded-full dark:bg-purple-900 dark:text-purple-300 w-fit">
			{{ content }}
		</p>
	</div>
	<div v-else class="px-3 py-4">
		<p class="text-black truncate">{{ content }}</p>
	</div>
</template>

<script setup>
	const { content, header } = defineProps(["content", "header"]);
</script>

<style lang="scss" scoped></style>
