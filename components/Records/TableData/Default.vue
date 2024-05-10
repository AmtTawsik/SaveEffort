<template>
	<div class="px-3 py-4 max-w-xs">
		<template v-if="header?.parent">
			<div v-if="header.get_from && output" class="text-black truncate">
				<p :id="`tooltip-trigger-${recordId}-${header.name}`">
					{{ output }}
				</p>
				<Tooltip
					v-if="header.tooltip"
					:content="output"
					:id="`${recordId}-${header.name}`" />
			</div>
			<div
				v-else-if="
					!isNullOrUndefined(content) &&
					!isNullOrUndefined(content[header.field]) &&
					!header.get_from
				"
				class="text-black truncate">
				<span
					v-if="
						Array.isArray(content[header.field]) &&
						content[header.field].length <= 0
					"
					class="italic">
					Empty
				</span>

				<div
					v-else-if="Array.isArray(content[header.field])"
					:class="
						(output = JSON.stringify(content[header.field]).replace(
							arrayRegex,
							' '
						))
					">
					<span :id="`tooltip-trigger-${recordId}-${header.name}`">
						{{ output }}
					</span>

					<Tooltip
						v-if="header.tooltip"
						:content="output"
						:id="`${recordId}-${header.name}`" />
				</div>

				<div
					v-else-if="
						header.dropdown &&
						!Array.isArray(content[header.field]) &&
						header.options?.length > 0
					"
					:class="
						(output = getDropdownName(content[header.field], header.options))
					">
					<span :id="`tooltip-trigger-${recordId}-${header.name}`">
						{{ output }}
					</span>

					<Tooltip
						v-if="header.tooltip"
						:content="output"
						:id="`${recordId}-${header.name}`" />
				</div>

				<div v-else>
					<span :id="`tooltip-trigger-${recordId}-${header.name}`">
						{{ content[header.field] }}
					</span>
					<Tooltip
						v-if="header.tooltip"
						:header="header"
						:content="content[header.field]"
						:id="`${recordId}-${header.name}`" />
				</div>
			</div>
			<p v-else class="text-black truncate italic">Empty</p>
		</template>

		<template v-else>
			<div
				v-if="header.get_from && output"
				:class="`text-black truncate ${(output = output.replace(
					/(^[,\s]+)|([,\s]+$)/g,
					''
				))}`">
				<p :id="`tooltip-trigger-${recordId}-${header.name}`">
					{{ output }}
				</p>
				<Tooltip
					v-if="header.tooltip"
					:content="output"
					:id="`${recordId}-${header.name}`" />
			</div>
			<div
				v-else-if="!isNullOrUndefined(content) && !header.get_from"
				class="text-black truncate">
				<span
					v-if="Array.isArray(content) && content.length <= 0"
					class="italic">
					Empty
				</span>
				<div v-else-if="Array.isArray(content)">
					<span
						:id="`tooltip-trigger-${recordId}-${header.name}`"
						:class="
							(output = JSON.stringify(content).replace(arrayRegex, ' '))
						">
						{{ output }}
					</span>
					<Tooltip
						v-if="header.tooltip"
						:content="output"
						:id="`${recordId}-${header.name}`" />
				</div>
				<div
					v-else-if="
						header.dropdown &&
						!Array.isArray(content) &&
						header.options?.length > 0
					">
					<span
						:id="`tooltip-trigger-${recordId}-${header.name}`"
						:class="(output = getDropdownName(content, header.options))">
						{{ output }}
					</span>
					<Tooltip
						v-if="header.tooltip"
						:content="output"
						:id="`${recordId}-${header.name}`" />
				</div>

				<div v-else>
					<span :id="`tooltip-trigger-${recordId}-${header.name}`">{{
						content
					}}</span>
					<Tooltip
						v-if="header.tooltip"
						:content="content"
						:header="header"
						:id="`${recordId}-${header.name}`" />
				</div>
			</div>
			<p v-else class="text-black truncate italic">Empty</p>
		</template>
	</div>
</template>

<script setup>
	import { initTooltips } from "flowbite";
	const { content, recordId, header, image } = defineProps([
		"content",
		"recordId",
		"header",
		"image",
	]);

	// initialize components based on data attribute selectors
	onMounted(() => {
		initTooltips();
	});

	const globalStore = useGlobalStore();

	const output = ref("");
	const arrayRegex = /[\[\]"]/g;

	let fromStore;

	const getDropdownName = (data, options) => {
		const res = options.filter((opt) => opt.value === content);

		if (res?.length > 0) return res[0].name;
		else return data;
	};

	if (header?.get_from) {
		fromStore = globalStore[header.get_from].useStore();
		await fromStore.initRecordsData();
	}

	if (header?.bidirectional === false) {
		let obj = {};
		obj[header.assign_to_field] = { $eq: recordId };

		fromStore.findRecords([obj]).then((res) => {
			if (res?.length > 0) {
				output.value = res[0][header.get_from_field];
			}
		});
	} else if (content && header?.get_from) {
		if (Array.isArray(content)) {
			content.forEach((item) => {
				fromStore.findById(item).then((res) => {
					if (res) {
						output.value = output.value.concat(
							`, ${res[header.get_from_field]}`
						);
					}
				});
			});
		} else {
			if (header.parent && content[header.field]) {
				fromStore.findById(content[header.field]).then((res) => {
					if (res) {
						output.value = res[header.get_from_field];
					}
				});
			} else {
				fromStore.findById(content).then((res) => {
					if (res) {
						output.value = res[header.get_from_field];
					}
				});
			}
		}
	}
</script>
