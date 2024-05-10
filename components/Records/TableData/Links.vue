<template>
	<div class="px-2 py-3 max-w-[200px] truncate">
		<a
			:href="content"
			target="_blank"
			class="px-3 py-2 font-medium rounded-full text-primary-600 bg-primary-100"
			>Open link</a
		>
	</div>
</template>

<script setup>
	const { content, header } = defineProps(["content", "header"]);
</script>
