<template>
	<div class="px-3 py-4 w-full">
		<div v-if="data" class="flex justify-start items-center">
			<img
				v-if="data?.image_url"
				class="w-8 h-8 rounded-full bg-cover"
				:src="data.image_url"
				referrerPolicy="no-referrer"
				alt="Profile image" />
			<img
				v-else
				class="w-8 h-8 rounded-full bg-cover"
				src="~/assets/images/default-user.png"
				alt="Default profile image" />
			<p class="pl-3 pr-6 text-black">{{ data[header.get_from_field] }}</p>
		</div>
	</div>
</template>

<script setup>
	const { content, header } = defineProps(["content", "header"]);

	const data = ref(null);

	if (header && header.get_from) {
		const globalStore = useGlobalStore();
		const store = globalStore[header.get_from].useStore();

		store.findById(content).then((res) => [(data.value = res)]);
	} else {
		data.value = await content;
	}
</script>
