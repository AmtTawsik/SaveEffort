<template>
	<div class="px-3 py-4 w-full">
		<div class="flex justify-start items-center">
			<img
				v-if="image"
				class="w-10 h-10 rounded-full bg-cover"
				:src="image"
				referrerPolicy="no-referrer"
				alt="Profile image" />
			<img
				v-else
				class="w-10 h-10 rounded-full bg-cover"
				src="~/assets/images/default-user.png"
				alt="Profile image" />
			<p class="pl-3 pr-6 text-black">{{ content }}</p>
		</div>
	</div>
</template>

<script setup>
	const { content, header, image } = defineProps([
		"content",
		"header",
		"image",
	]);
</script>
