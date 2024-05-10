<script setup>
	import {
		ChevronLeftIcon,
		ChevronRightIcon,
		ArrowLeftIcon,
		ArrowRightIcon,
	} from "@heroicons/vue/24/solid";

	const emit = defineEmits(["change"]);

	const { totalPages, currentPage } = defineProps([
		"totalPages",
		"currentPage",
	]);

	const totalDisplayPages = 7;
	const halfDisplayPages = Math.floor(totalDisplayPages / 2);
	let startPage = Math.max(1, currentPage - halfDisplayPages);
	let endPage = Math.min(totalPages, startPage + totalDisplayPages - 1);

	if (endPage - startPage + 1 < totalDisplayPages) {
		startPage = Math.max(1, endPage - totalDisplayPages + 1);
	}

	const pages = Array.from(
		{ length: endPage - startPage + 1 },
		(_, index) => startPage + index
	);

	if (startPage > 1) {
		pages[0] = 1;
		pages[1] = "...";
	}

	if (endPage < totalPages) {
		pages[pages.length - 1] = totalPages;
		pages[pages.length - 2] = "...";
	}

	const goToPage = (page) => {
		emit("change", page);
	};
</script>

<template>
	<nav v-if="totalPages > 1" aria-label="Page navigation example">
		<ul class="inline-flex items-center gap-4 -space-x-px">
			<li>
				<button
					@click="goToPage(currentPage - 1)"
					class="flex items-center text-gray-500 disabled:hover:text-gray-500 disabled:cursor-not-allowed hover:text-gray-700"
					:disabled="currentPage === 1">
					<ChevronLeftIcon class="w-5 h-5 max-xl:w-4 max-xl:h-4" />
					Prev
				</button>
			</li>

			<li v-for="(page, index) in pages" :key="index">
				<button class="leading-tight w-7 h-7" v-if="page === '...'" disabled>
					...
				</button>
				<button
					v-else
					@click="goToPage(page)"
					:class="`flex px-2 py-1.5 items-center justify-center font-medium rounded-full hover:bg-primary-400 max-xl:text-sm ${
						page === currentPage && 'bg-primary-400'
					}`">
					{{ page }}
				</button>
			</li>

			<li>
				<button
					@click="goToPage(currentPage + 1)"
					class="flex items-center text-gray-500 disabled:hover:text-gray-500 disabled:cursor-not-allowed hover:text-gray-700"
					:disabled="currentPage === totalPages">
					Next
					<ChevronRightIcon class="w-5 h-5 max-xl:w-4 max-xl:h-4" />
				</button>
			</li>
		</ul>
	</nav>
</template>
