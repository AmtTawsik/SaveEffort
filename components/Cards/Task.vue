<template>
	<div v-if="data" class="flex items-center justify-center gap-4">
		<img
			class="w-10 h-10 rounded-full bg-cover"
			:src="data?.image_url"
			alt="Profile image" />
		<div>
			<p class="font-medium">{{ data[header.get_from_field] }}</p>
			<p class="text-sm text-gray-600">{{ data?.primary_email }}</p>
		</div>
	</div>
</template>

<script setup>
	const { data, header } = defineProps(["data", "header"]);

	console.log(data, header);

	// if (data) data = await data;
</script>
