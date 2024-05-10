<script setup>
	import { initTabs } from 'flowbite';

	const { content } = defineProps(['content']);
	const { currRecord, drawer } = content.currentRecord();

	const toStore = content.store();

	onMounted(() => {
		initTabs();
	});

	onBeforeRouteLeave(() => {
		if (drawer.value) {
			drawer.value.hide();
		}
	});

	const imageUploadHandler = (event) => {
		const { currentUser } = useRealmApp();

		if (event) {
			if (
				!currRecord.value.update_logs ||
				currRecord.value.update_logs.length === 0
			)
				currRecord.value.update_logs = [];

			currRecord.value.update_logs.push({
				type: 'edit',
				sub_type: 'image',
				field: 'image_url',
				updated_at: new Date(),
				updated_by: currentUser?.id,
			});

			currRecord.value.image_url = event.Location;

			let set_data = {
				image_url: event.Location,
				update_logs: currRecord.value.update_logs,
			};

			toStore.addField(set_data, currRecord.value);
		}
	};
</script>

<template>
	<div
		id="drawer-right"
		class="fixed top-0 right-0 z-50 h-screen overflow-y-auto transition-transform translate-x-full bg-white w-[45%] max-2xl:w-1/2 max-xl:w-2/3 max-lg:w-1/2 max-md:w-[55%] max-sm:w-[80%]"
		tabindex="-1"
		aria-labelledby="drawer-right-label"
	>
		<header class="bg-slate-200 px-5 py-6 max-xl:p-4">
			<div class="flex justify-between max-sm:flex-col max-sm:gap-5">
				<div class="flex items-center gap-4">
					<CardsProfilePicture
						:image="currRecord?.image_url"
						@uploaded="imageUploadHandler($event)"
					/>
					<div>
						<div class="flex items-center gap-2">
							<h3 class="font-medium text-lg max-xl:text-base">
								{{ currRecord?.full_name }}
							</h3>
							<span
								class="bg-green-100 border rounded-md border-green-400 text-green-600 text-sm px-2 max-xl:text-xs"
								>{{ currRecord?.status }}</span
							>
						</div>

						<p class="text-sm text-slate-500 mb-2 max-lg:text-xs">
							{{ currRecord?.department }} -
							{{ currRecord?.job_title }}
						</p>
					</div>
				</div>
			</div>
		</header>

		<div class="border-b border-gray-200">
			<ul
				class="flex flex-wrap -mb-px text-sm font-medium text-center"
				id="myTab"
				data-tabs-toggle="#myTabContent"
				role="tablist"
			>
				<template v-for="(tab, key) in content?.tab_headers" :key="key">
					<li v-if="tab.read" role="presentation">
						<button
							class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 uppercase max-lg:ml-2"
							:id="`${key}-tab`"
							:data-tabs-target="`#${key}`"
							type="button"
							role="tab"
							:aria-controls="`${key}`"
							aria-selected="false"
						>
							{{ key }}
						</button>
					</li>
				</template>
			</ul>
		</div>

		<div id="myTabContent">
			<template v-for="(tab, key) in content?.tab_headers" :key="key">
				<SideDrawerTabs :tab="tab" :id="key" :content="content" />
			</template>
		</div>
	</div>
</template>
