<template>
	<div v-if="content && header" class="px-2 py-3">
		<div
			class="flex items-center px-3 py-2 max-lg:p-[.1rem] -skew-x-12"
			:style="{
				backgroundColor: getPipelineColor(
					colors,
					content.current_stage,
					content.current_stage
				).bg,
				color: getPipelineColor(
					colors,
					content.current_stage,
					content.current_stage
				).text,
			}">
			<div>
				<span
					:id="`tooltip-trigger-${recordId}-${header.name}`"
					class="skew-x-12 font-semibold">
					{{ header.stages[content.current_stage] }}
				</span>
			</div>
		</div>
		<Tooltip
			v-if="header.tooltip"
			:content="header.stages[content.current_stage]"
			:id="`${recordId}-${header.name}`" />
	</div>
</template>

<script setup>
	const { content, header, recordId } = defineProps([
		"content",
		"header",
		"recordId",
	]);

	const colors = ref(null);

	if (header?.colors) {
		colors.value = header.colors;
	}
</script>
