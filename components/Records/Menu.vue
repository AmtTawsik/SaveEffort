<template>
	<div
		:id="`recordsMenuDropdown-${id}`"
		class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-40 dark:bg-gray-700">
		<ul
			class="py-2 text-sm text-gray-700 dark:text-gray-200"
			:aria-labelledby="`recordsMenuDropdownButton-${id}`">
			<li
				@click="emit('update')"
				v-if="hasUpdate"
				:id="`${tableName}-update-modal-button`"
				class="flex justify-between items-center hover:bg-gray-100 px-4 py-2 font-medium">
				<a href="#" class="block">Edit</a>
				<PencilIcon class="w-6 h-6 text-primary-500" />
			</li>
			<li
				v-if="hasDelete"
				@click="emit('delete')"
				:id="`${tableName}-delete-modal-button`"
				class="flex justify-between items-center hover:bg-gray-100 px-4 py-2 font-medium">
				<a href="#" class="block">Delete</a>
				<TrashIcon class="w-6 h-6 text-red-500" />
			</li>
		</ul>
	</div>
</template>

<script setup>
	import { initDropdowns } from "flowbite";
	import { TrashIcon, PencilIcon } from "@heroicons/vue/24/solid";

	const { id, tableName, hasUpdate, hasDelete } = defineProps([
		"id",
		"tableName",
		"hasUpdate",
		"hasDelete",
	]);

	const emit = defineEmits(["update", "delete"]);

	onMounted(() => {
		initDropdowns();
	});
</script>

<style lang="scss" scoped></style>
