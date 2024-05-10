<script setup>
	import { Tooltip } from "flowbite";

	const { header, content, id, placement } = defineProps([
		"header",
		"content",
		"id",
		"placement",
	]);

	onMounted(() => {
		const $targetEl = document.getElementById(
			`flowbite-tooltip-animation-${id}`
		);

		const $triggerEl = document.getElementById(`tooltip-trigger-${id}`);

		const options = {
			placement: "bottom",
			triggerType: "hover",
			onHide: () => {},
			onShow: () => {},
			onToggle: () => {},
		};

		const instanceOptions = {
			id: `flowbite-tooltip-animation-${id}`,
			override: true,
		};

		new Tooltip($targetEl, $triggerEl, options, instanceOptions);
	});
</script>

<template>
	<div
		:id="`flowbite-tooltip-animation-${id}`"
		role="tooltip"
		class="absolute z-10 invisible inline-block px-3 py-2 text-xs font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip">
		{{ content }}
		<div
			v-if="!header || header.type !== 'textarea'"
			class="tooltip-arrow"
			data-popper-arrow></div>
	</div>
</template>
