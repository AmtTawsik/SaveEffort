<script setup>
	onMounted(() => {
		// setup available elements
		const $buttonElement = document.querySelector("#button");
		const $drawerElement = document.querySelector("#sidebar");
		const $closeButtons = document.querySelectorAll("#closeButton");

		// set drawer options
		const drawerOptions = {
			backdropClasses:
				"bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40",
		};

		// create a new drawer instance
		if ($drawerElement) {
			const drawer = new Drawer($drawerElement, drawerOptions);

			// set event listeners for the button to show the drawer
			$buttonElement.addEventListener("click", () => drawer.toggle());
			$closeButtons.forEach((el) => {
				el.addEventListener("click", () => drawer.hide());
			});
		}
	});
</script>

<template>
	<div>
		<div class="relative">
			<button
				id="button"
				type="button"
				class="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 absolute top-3.5 left-1.5 bg-gray-200">
				<span class="sr-only">Open sidebar</span>
				<svg
					class="w-6 h-6"
					aria-hidden="true"
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg">
					<path
						clip-rule="evenodd"
						fill-rule="evenodd"
						d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
				</svg>
			</button>
			<SideBar />
		</div>

		<main class="p-0 lg:ml-64">
			<slot />
		</main>
	</div>
</template>
