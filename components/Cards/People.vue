<template>
	<div
		v-if="data"
		:class="padding === false ? '' : 'px-3 py-4'"
		class="flex items-center justify-center gap-4">
		<img
			v-if="data?.image_url"
			class="w-10 h-10 rounded-full bg-cover"
			:src="image"
			referrerPolicy="no-referrer"
			alt="Profile image" />
		<img
			v-else
			class="w-10 h-10 rounded-full bg-cover"
			src="~/assets/images/default-user.png"
			alt="Profile image" />
		<div>
			<p class="font-medium">{{ data?.full_name }}</p>
			<p class="text-sm">{{ data?.primary_email }}</p>
		</div>
	</div>
</template>

<script setup>
	const { padding, content } = defineProps(["padding", "content"]);

	const data = ref(null);
	if (content) data.value = await content;
</script>
