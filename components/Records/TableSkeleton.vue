<script setup>
	const { style } = defineProps(["style"]);
</script>

<template>
	<div :class="`flex flex-col gap-6 ${style}`">
		<div role="status" class="space-y-2.5 animate-pulse pt-2">
			<div class="flex items-center w-full space-x-4">
				<div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-40"></div>
				<div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-48"></div>
				<div
					class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
			</div>

			<div class="flex items-center w-full space-x-4">
				<div
					class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
				<div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-80"></div>
				<div
					class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
			</div>

			<span class="sr-only">Loading...</span>
		</div>
		<div
			role="status"
			class="w-full p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700">
			<div class="flex items-center justify-between">
				<div>
					<div
						class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
					<div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
				</div>
				<div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
			</div>
			<div class="flex items-center justify-between pt-4">
				<div>
					<div
						class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
					<div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
				</div>
				<div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
			</div>
			<div class="flex items-center justify-between pt-4">
				<div>
					<div
						class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
					<div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
				</div>
				<div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
			</div>
			<div class="flex items-center justify-between pt-4">
				<div>
					<div
						class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
					<div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
				</div>
				<div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
			</div>
			<div class="flex items-center justify-between pt-4">
				<div>
					<div
						class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
					<div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
				</div>
				<div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
			</div>
			<span class="sr-only">Loading...</span>
		</div>
	</div>
</template>
