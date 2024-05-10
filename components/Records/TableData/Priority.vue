<template>
	<div v-if="content?.toLowerCase() === 'low'" class="px-3 py-4">
		<p
			class="flex justify-center items-center bg-yellow-100 text-yellow-500 text-sm font-semibold px-3 py-2 rounded-full dark:bg-yellow-900 dark:text-yellow-300 w-fit">
			{{ content }}
		</p>
	</div>
	<div v-else-if="content?.toLowerCase() === 'medium'" class="px-3 py-4">
		<p
			class="flex justify-center items-center bg-blue-100 text-blue-500 text-sm font-semibold px-3 py-2 rounded-full dark:bg-blue-900 dark:text-blue-300 w-fit">
			{{ content }}
		</p>
	</div>
	<div v-else-if="content?.toLowerCase() === 'high'" class="px-3 py-4">
		<p
			class="flex justify-center items-center bg-red-100 text-red-500 text-sm font-semibold px-3 py-2 rounded-full dark:bg-red-900 dark:text-red-300 w-fit">
			{{ content }}
		</p>
	</div>
	<div v-else-if="content" class="px-3 py-4">
		<p class="text-black truncate">{{ content }}</p>
	</div>
	<div v-else class="px-3 py-4">
		<p class="text-black truncate italic">Empty</p>
	</div>
</template>

<script setup>
	const { content, header } = defineProps(["content", "header"]);
</script>
