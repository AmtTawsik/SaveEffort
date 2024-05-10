<script setup>
	import { ChevronDoubleRightIcon } from "@heroicons/vue/24/outline";

	const { data, header, pipelineField } = defineProps([
		"data",
		"header",
		"pipelineField",
	]);

	const { currentUser } = useRealmApp();
	const emit = defineEmits(["updateRecord"]);

	const colors = ref(null);

	if (header?.colors) {
		colors.value = header.colors;
	}

	const updateStatus = (record, type) => {
		let history = {};
		switch (type) {
			case 0: //previous stage
				if (record[pipelineField]?.current_stage === 0) return null;

				record[pipelineField].current_stage =
					record[pipelineField].current_stage - 1;
				record[pipelineField].stages[record[pipelineField].current_stage].date =
					new Date();
				record[pipelineField].stages[
					record[pipelineField].current_stage + 1
				].date = null;
				history.sub_type = "previous";
				history.previous_stage_name =
					record[pipelineField]?.stages[
						data[pipelineField]?.current_stage + 1
					].name;
				break;

			case 1: //next stage
				if (
					record[pipelineField]?.stages?.length - 1 ===
					record[pipelineField]?.current_stage
				)
					return null;

				record[pipelineField].current_stage =
					record[pipelineField].current_stage + 1;
				record[pipelineField].stages[record[pipelineField].current_stage].date =
					new Date();
				history.sub_type = "previous";
				history.previous_stage_name =
					record[pipelineField]?.stages[
						data[pipelineField]?.current_stage - 1
					].name;
				break;
		}

		let set_data = {};

		history.to = record[pipelineField].current_stage;
		history.updated_at = new Date();
		history.type = "pipeline";
		history.field = pipelineField;
		history.updated_by = currentUser?.id;
		history.updated_at = new Date();
		history.stage_name =
			record[pipelineField]?.stages[data[pipelineField]?.current_stage].name;

		if (!data.update_logs) {
			data.update_logs = [];
		}

		set_data[pipelineField] = record[pipelineField];
		data["update_logs"].push(history);
		set_data["update_logs"] = data.update_logs;

		emit("updateRecord", { set: set_data, data: record });
	};
</script>

<template>
	<div v-if="data && data[pipelineField]">
		<ol
			class="flex gap-1 flex-wrap w-full text-sm font-medium text-center text-gray-500 bg-white rounded-md max-lg:justify-normal">
			<li
				v-for="(stage, index) in data[pipelineField]?.stages"
				:key="index"
				class="flex items-center px-3 py-2 max-lg:p-[.1rem] -skew-x-12"
				:style="{
					backgroundColor: getPipelineColor(
						colors,
						data[pipelineField].current_stage,
						index
					).bg,
					color: getPipelineColor(
						colors,
						data[pipelineField].current_stage,
						index
					).text,
				}">
				<h2 class="skew-x-12 font-semibold">{{ stage.name }}</h2>
				<ChevronDoubleRightIcon
					v-if="index !== data[pipelineField]?.stages?.length"
					class="w-4 h-4 ml-2" />
			</li>
		</ol>

		<div class="rounded border border-slate-300 mt-4">
			<div class="px-4 py-3 border-b border-b-slate-300">
				<h3 class="text-sm font-semibold">Detail</h3>
			</div>

			<div class="p-4 grid grid-cols-[40fr_60fr] gap-y-4 max-lg:grid-cols-1">
				<div>
					<span class="text-slate-500 text-sm font-medium">Current Status</span>
					<div class="flex items-center gap-2">
						<div
							class="uppercase bg-green-900 rounded-full px-2 py-[.1rem] w-fit text-white flex items-center justify-center">
							<span class="text-[.6rem] font-medium">Active</span>
						</div>
					</div>
				</div>

				<div>
					<span class="text-slate-500 text-sm font-medium">Stage</span>
					<p class="text-sm font-semibold text-gray-700">
						{{
							data[pipelineField]?.stages[data[pipelineField]?.current_stage]
								.name
						}}
					</p>
				</div>

				<div>
					<div>
						<span class="text-slate-500 text-sm font-medium">Date</span>
						<p class="text-sm font-semibold text-gray-700">
							{{
								formatDate(
									data[pipelineField]?.stages[
										data[pipelineField]?.current_stage
									].date
								)
							}}
						</p>
					</div>
				</div>

				<div class="flex gap-2 self-center justify-self-end">
					<button
						v-if="data[pipelineField]?.current_stage !== 0"
						@click="updateStatus(data, 0)"
						class="text-xs border border-blue-500 hover:bg-blue-500 hover:text-white rounded-full px-3 py-2 text-blue-500 font-bold">
						Previus stage
					</button>
					<button
						v-if="data[pipelineField]?.current_stage !== 7"
						@click="updateStatus(data, 1)"
						class="text-xs border border-green-500 hover:bg-green-500 hover:text-white rounded-full px-3 py-2 text-green-500 font-bold">
						Next stage
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
