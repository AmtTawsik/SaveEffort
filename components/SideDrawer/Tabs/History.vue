<script setup>
	import { PencilIcon } from "@heroicons/vue/24/solid";

	const { data, headers } = defineProps(["data", "headers"]);

	const { userStore } = useGlobalStore();

	const bucket = ref(new Map());
	const store = userStore?.useStore();

	await store?.initRecordsData();

	const getRecord = async (id) => {
		let temp = bucket.value.get(id);

		if (!temp) {
			const tempData = await store?.findByField("user_id", id);

			bucket.value.set(id, tempData);

			return tempData;
		} else {
			return temp;
		}
	};

	if (data) {
		data.update_logs?.forEach((item) => {
			getRecord(item.updated_by);
		});
		await getRecord(data.created_by);
	}

	const sortByDate = (array) => {
		const result = array.sort((a, b) => b.updated_at - a.updated_at);
		return result;
	};

	const getPrimaryHeaderField = (headers) => {
		if (!headers) return null;

		const temp = headers.find((header) => header.is_primary === true);

		return temp.field;
	};
</script>

<template>
	<div v-if="data" class="flex flex-col gap-4 pl-2">
		<ol
			class="flex flex-col gap-8 relative border-l-2 border-gray-200 dark:border-gray-700">
			<template v-if="data?.update_logs?.length > 0">
				<li
					v-for="log in sortByDate(data?.update_logs)"
					:key="log.id"
					class="ml-6">
					<span
						class="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
						<img
							v-if="bucket.get(log.updated_by)?.image_url"
							class="rounded-full shadow-lg object-cover"
							:src="bucket.get(log.updated_by)?.image_url"
							referrerPolicy="no-referrer"
							alt="User image" />
						<img
							v-else
							class="rounded-full shadow-lg object-cover"
							src="~/assets/images/default-user.png"
							alt="Default user image" />
					</span>
					<div
						class="items-start justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:flex dark:bg-gray-700 dark:border-gray-600 gap-4">
						<time
							class="mb-1 text-xs font-normal text-gray-500 sm:order-last sm:mb-0 whitespace-nowrap"
							>{{ log.updated_at?.toLocaleString() }}</time
						>
						<h2
							class="flex text-sm font-normal text-gray-500 dark:text-gray-300 gap-1 flex-wrap">
							<span
								v-if="bucket.get(log.updated_by)"
								class="whitespace-nowrap"
								>{{ bucket.get(log.updated_by)?.full_name }}</span
							>
							<span v-else class="whitespace-nowrap">User</span>
							<template v-if="log.type === 'assign'">
								<template v-if="log.sub_type === 'add'">
									<span class="font-semibold whitespace-nowrap">assigned</span>
									<span class="font-semibold whitespace-nowrap">{{
										log.to
									}}</span>
									<span class="whitespace-nowrap">to</span>
									<span
										class="font-semibold text-blue-600 dark:text-blue-500 whitespace-nowrap"
										>{{ data[getPrimaryHeaderField(headers)] }}</span
									>
								</template>
								<template v-if="log.sub_type === 'delete'">
									<span class="font-semibold whitespace-nowrap">removed</span>
									<span class="font-semibold whitespace-nowrap">{{
										log.to
									}}</span>
									<span class="whitespace-nowrap">from</span>
									<span
										class="font-semibold text-blue-600 dark:text-blue-500 whitespace-nowrap"
										>{{ data[getPrimaryHeaderField(headers)] }}</span
									>
								</template>
							</template>

							<template v-else-if="log.type === 'add'">
								<span
									v-if="
										log.sub_type === 'document' || log.field === 'documents'
									"
									class="font-semibold whitespace-nowrap"
									>added a new document
									<span
										class="font-semibold text-blue-600 dark:text-blue-500 whitespace-nowrap"
										>{{ log.to }}</span
									>
								</span>
								<span
									v-else-if="log.sub_type === 'chip'"
									class="font-semibold whitespace-nowrap"
									>added
									<span
										class="font-semibold text-blue-600 dark:text-blue-500 whitespace-nowrap"
										>{{ log.to }}</span
									>
									in {{ log.field }}</span
								>
							</template>

							<template v-else-if="log.type === 'edit'">
								<span
									v-if="log.sub_type === 'image'"
									class="font-semibold whitespace-nowrap"
									>changed profile picture</span
								>
								<span
									class="font-semibold text-blue-600 dark:text-blue-500 whitespace-nowrap"
									>{{ log.to }}</span
								>
							</template>

							<template v-else-if="log.type === 'delete'">
								<span
									v-if="
										log.sub_type === 'document' || log.field === 'documents'
									"
									class="font-semibold whitespace-nowrap"
									>deleted document
									<span
										class="font-semibold text-blue-600 dark:text-blue-500 whitespace-nowrap"
										>{{ log.to }}</span
									>
								</span>
								<span
									v-else-if="log.sub_type === 'chip'"
									class="font-semibold whitespace-nowrap"
									>deleted
									<span
										class="font-semibold text-blue-600 dark:text-blue-500 whitespace-nowrap"
										>{{ log.to }}</span
									>
									from {{ log.field }}</span
								>
							</template>

							<template v-else-if="log.type === 'pipeline'">
								<span class="font-semibold whitespace-nowrap"
									>Changed the pipeline stage
									{{ log.previous_stage_name ? "from" : " " }}
									<span
										class="font-semibold text-blue-600 dark:text-blue-500 whitespace-nowrap">
										{{ log.previous_stage_name }}
									</span>
									to
									<span
										class="font-semibold text-blue-600 dark:text-blue-500 whitespace-nowrap">
										{{ log.stage_name }}
									</span>
								</span>
							</template>

							<template v-else>
								<template v-for="(item, index) in log.fields" :key="item">
									<template v-if="item.type === 'added'">
										<span class="font-semibold whitespace-nowrap">{{
											item.type
										}}</span>
										<span class="font-semibold whitespace-nowrap">{{
											item.field
										}}</span>
										<span class="whitespace-nowrap">as</span>
										<span
											class="font-semibold text-blue-600 dark:text-blue-500"
											>{{ item.after }}</span
										>
									</template>
									<template v-else-if="item.type === 'edited'">
										<span class="font-semibold whitespace-nowrap">{{
											item.type
										}}</span>
										<span class="font-semibold whitespace-nowrap">{{
											item.field
										}}</span>
										<template v-if="item.before">
											<span>from</span>
											<span
												class="font-semibold text-blue-600 dark:text-blue-500"
												>{{ item.before }}</span
											>
										</template>
										<span>to</span>
										<span
											class="font-semibold text-blue-600 dark:text-blue-500"
											>{{ item.after }}</span
										>
									</template>
									<template v-else-if="item.type === 'changed'">
										<span class="font-semibold whitespace-nowrap">{{
											item.type
										}}</span>
										<span class="font-semibold whitespace-nowrap">{{
											item.field
										}}</span>
										<template v-if="item.before">
											<span>from</span>
											<span
												class="font-semibold text-blue-600 dark:text-blue-500"
												>{{ item.before }}</span
											>
										</template>
										<span>to</span>
										<span
											class="font-semibold text-blue-600 dark:text-blue-500"
											>{{ item.after }}</span
										>
									</template>
									<span v-if="index + 1 !== log?.fields?.length">and</span>
								</template>
							</template>
						</h2>
					</div>
				</li>
			</template>

			<li class="ml-6">
				<span
					class="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
					<img
						v-if="bucket.get(data.created_by)?.image_url"
						class="rounded-full shadow-lg"
						:src="bucket.get(data.created_by)?.image_url"
						referrerPolicy="no-referrer"
						alt="User image" />
					<img
						v-else
						class="rounded-full shadow-lg"
						src="~/assets/images/default-user.png"
						alt="Default user image" />
				</span>
				<div
					class="items-start justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:flex dark:bg-gray-700 dark:border-gray-600 gap-4">
					<time
						class="mb-1 text-xs font-normal text-gray-500 sm:order-last sm:mb-0 whitespace-nowrap"
						>{{ data.created_at?.toLocaleString() }}</time
					>
					<h2
						class="flex text-sm font-normal text-gray-500 dark:text-gray-300 gap-1 flex-wrap">
						<span
							v-if="bucket.get(data.created_by)"
							class="whitespace-nowrap"
							>{{ bucket.get(data.created_by)?.full_name }}</span
						>
						<span v-else class="whitespace-nowrap">User</span>

						<span class="whitespace-nowrap"
							><span class="font-semibold">created</span> the document</span
						>
					</h2>
				</div>
			</li>
		</ol>
	</div>
	<div v-else>
		<h1 class="md:text-xl text-lg font-semibold">No history</h1>
	</div>
</template>
