<template>
	<div class="px-2 py-3">
		<div class="flex gap-2">
			<span
				v-for="keyword in content"
				:key="keyword"
				class="px-3 py-2 rounded-full bg-blue-100 text-blue-600">
				{{ keyword }}
			</span>
		</div>
	</div>
</template>

<script setup>
	const { content, header } = defineProps(["content", "header"]);
</script>
