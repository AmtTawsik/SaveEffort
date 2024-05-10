<template>
	<div class="px-3 py-4">
		<div v-if="header.parent" class="text-black">
			{{ formatDate(content[header.field]) }}
		</div>
		<div v-else class="text-black">{{ formatDate(content) }}</div>
	</div>
</template>

<script setup>
	const { content, header } = defineProps(["content", "header"]);
</script>
