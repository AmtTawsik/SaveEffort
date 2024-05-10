<script setup>
	import { ArrowLeftOnRectangleIcon } from "@heroicons/vue/24/solid";

	const icons = await import("@heroicons/vue/24/solid");

	const { logOut, currentUser } = useRealmApp();
	const { currentPage, pages, setPages } = usePages();

	const pageHandler = (path) => {
		if (path) {
			navigateTo(path);
		}
	};

	onMounted(() => {
		if (pages.value?.length < 1) {
			setPages();
		}
		pageHandler();
	});
</script>

<template>
	<aside
		id="sidebar"
		class="fixed top-0 left-0 z-50 w-64 h-screen transition-transform -translate-x-full lg:translate-x-0"
		aria-label="Sidebar">
		<div
			class="flex flex-col justify-between h-full px-3 py-4 overflow-y-auto bg-[#282c38]">
			<div>
				<h2
					class="p-2 mb-2 text-3xl font-extrabold text-white cursor-pointer uppercase"
					@click="pageHandler('/home')">
					Save<span class="text-primary-500">efforts</span>
				</h2>
				<ul v-if="currentPage" class="space-y-2 font-medium">
					<li
						v-for="page in pages"
						:key="page.to"
						@click="pageHandler(page.to)"
						class="flex items-center p-2 text-white hover:text-black rounded-lg hover:bg-primary-400 cursor-pointer"
						:class="{ 'bg-primary-400 !text-black': currentPage === page.to }">
						<component
							:is="icons[page.icon]"
							class="w-6 h-6 text-gray-500 transition duration-75" />
						<span class="ml-3">{{ page.name }}</span>
					</li>
				</ul>
			</div>
			<div
				v-if="currentUser"
				class="flex flex-col gap-4 bg-primary-400 rounded-lg p-2">
				<div class="flex items-center space-x-2.5">
					<img
						v-if="currentUser?.customData?.image_url"
						class="w-10 h-10 rounded-full"
						:src="currentUser.customData.image_url"
						referrerpolicy="no-referrer"
						alt="" />
					<img
						v-else
						class="w-10 h-10 rounded-full"
						src="~/assets/images/default-user.png"
						alt="" />
					<div class="w-full overflow-hidden">
						<h1 v-if="currentUser?.customData?.full_name" class="font-medium">
							{{ currentUser?.customData?.full_name }}
						</h1>
						<h2
							v-if="currentUser?.customData?.primary_email"
							class="text-sm text-gray-700">
							{{ currentUser?.customData?.primary_email }}
						</h2>
					</div>
				</div>
				<div
					@click="logOut()"
					class="flex items-center p-2 text-black hover:text-white rounded-lg hover:bg-[#282c38] cursor-pointer">
					<ArrowLeftOnRectangleIcon
						class="w-6 h-6 text-gray-500 transition duration-75" />
					<span class="ml-3">Sign out</span>
				</div>
			</div>
		</div>
	</aside>
</template>
