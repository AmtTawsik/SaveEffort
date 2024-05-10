<template>
	<div
		class="flex gap-2 p-2.5 overflow-auto bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
		<input
			:required="requiredChip"
			type="text"
			v-model="currentChip"
			class="bg-gray-50 border-none text-gray-900 text-base focus:ring-transparent p-0 max-w-[140px]"
			@keypress.enter="saveChip()" />

		<div
			v-for="(chip, index) in chips"
			:key="index"
			@click="removeChip(index)"
			class="px-2 bg-primary-400 flex gap-1.5 justify-center items-center rounded-2xl cursor-pointer">
			<span class="whitespace-nowrap">{{ chip }}</span>
			<XCircleIcon class="w-4 h-4" />
		</div>
	</div>
</template>

<script setup>
	import { XCircleIcon } from "@heroicons/vue/24/solid";

	const { fieldValue, required } = defineProps(["fieldValue", "required"]);
	const emit = defineEmits(["change"]);
	const requiredChip = ref(required);

	const currentChip = ref("");
	const chips = ref([]);

	if (fieldValue?.length > 0) {
		chips.value = fieldValue;
	}

	const saveChip = () => {
		if (currentChip.value.trim() === "") return;
		chips.value.push(currentChip.value);

		if (chips.value.length > 0) {
			requiredChip.value = false;
		}

		currentChip.value = "";
		emit("change", JSON.parse(JSON.stringify(chips.value)));
	};

	const removeChip = (index) => {
		chips.value.splice(index, 1);

		if (chips.value.length === 0) {
			requiredChip.value = required;
		}

		emit("change", JSON.parse(JSON.stringify(chips.value)));
	};
</script>

<style lang="scss" scoped></style>
