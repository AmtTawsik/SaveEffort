<script setup>
	import { PencilSquareIcon, XMarkIcon } from "@heroicons/vue/24/outline";
	import { XCircleIcon } from "@heroicons/vue/24/solid";

	const { data, header, canEdit } = defineProps(["data", "header", "canEdit"]);
	const emit = defineEmits(["updateRecord"]);
	const recordData = ref(null);
	const currentChip = ref("");
	const chips = ref([]);
	const isEditing = ref(false);

	if (data && header && data[header.field]?.length > 0) {
		chips.value = JSON.parse(JSON.stringify(data[header.field]));
	}

	const saveChip = (data) => {
		if (currentChip.value) {
			chips.value.push(currentChip.value);
			currentChip.value = "";
			updateRecordHandler(data);
		}
	};

	const removeChip = (data, index) => {
		chips.value.splice(index, 1);
		updateRecordHandler(data);
	};

	const updateRecordHandler = async (data) => {
		let set_data = {};
		let update_logs = {};
		const { currentUser } = useRealmApp();
		const { added, deleted, updated } = compareArrays(
			data[header.field],
			chips.value
		);

		if (added?.length > 0) {
			update_logs = {
				type: "add",
				sub_type: "chip",
				field: header.field,
				to: added[0],
				updated_at: new Date(),
				updated_by: currentUser?.id,
			};
		} else if (deleted?.length > 0) {
			update_logs = {
				type: "delete",
				sub_type: "chip",
				field: header.field,
				to: deleted[0],
				updated_at: new Date(),
				updated_by: currentUser?.id,
			};
		}

		set_data[header.field] = chips.value;
		data[header.field] = JSON.parse(JSON.stringify(chips.value));

		if (!data.update_logs) {
			data.update_logs = [];
		}

		data.update_logs.push(update_logs);
		set_data.update_logs = data.update_logs;

		console.log(set_data);
		emit("updateRecord", { set: set_data, data: data });
	};
</script>

<template>
	<div v-if="data && header" class="flex flex-col gap-4">
		<div class="flex gap-2 flex-wrap">
			<div
				v-for="(keyword, index) in chips"
				:key="keyword"
				@click="removeChip(data, index)"
				class="flex gap-1.5 justify-center items-center px-3 py-2 rounded-full bg-blue-100 text-blue-600 cursor-pointer">
				<span>
					{{ keyword }}
				</span>
				<XMarkIcon class="w-4 h-4 text-gray-700" />
			</div>
		</div>
		<input
			v-if="canEdit"
			type="text"
			v-model="currentChip"
			:placeholder="`Type your ${header.name} and press enter to add`"
			class="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
			@keypress.enter="saveChip(data)" />
	</div>
</template>
