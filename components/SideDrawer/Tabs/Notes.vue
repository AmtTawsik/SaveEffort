<script setup>
	import { PencilSquareIcon } from "@heroicons/vue/24/outline";

	const { currentUser } = useRealmApp();
	const { userStore } = useGlobalStore();
	const { data, canEdit } = defineProps(["data", "canEdit"]);
	const emit = defineEmits(["updateRecord"]);

	const comment = ref("");

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
		data.notes?.forEach((item) => {
			getRecord(item.added_by);
		});
	}

	const sortByDate = (array) => {
		if (array) return array.sort((a, b) => b.added_at - a.added_at);

		return null;
	};

	const addNote = (record) => {
		if (comment.value.length <= 4) return;
		console.log(record);

		if (record?.notes === null || !Array.isArray(record?.notes)) {
			record.notes = [];
			record.notes.push({
				added_by: currentUser.id,
				added_at: new Date(),
				content: comment.value,
			});
		} else {
			record.notes.push({
				added_by: currentUser.id,
				added_at: new Date(),
				content: comment.value,
			});
		}

		let set_data = {};

		set_data.notes = record.notes;

		console.log(set_data);
		console.log(record.notes);

		emit("updateRecord", { set: set_data, data: record });
		bucket.value.set(currentUser.id, currentUser.customData);

		comment.value = "";
	};
</script>

<template>
	<section v-if="data" class="flex flex-col gap-6 bg-white dark:bg-gray-900">
		<form v-if="canEdit" @submit.prevent="addNote(data)" class="">
			<div
				class="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
				<label for="comment" class="sr-only">Your comment</label>
				<textarea
					id="comment"
					rows="6"
					v-model="comment"
					class="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
					placeholder="Write your note..."
					required></textarea>
			</div>
			<button
				type="submit"
				class="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
				Post
			</button>
		</form>
		<template v-if="data?.notes?.length > 0">
			<article
				v-for="note in sortByDate(data.notes)"
				:key="note.id"
				class="p-6 text-base bg-gray-50 rounded-lg dark:bg-gray-900">
				<footer class="flex justify-between items-center mb-2">
					<div class="flex items-center">
						<p
							class="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white">
							<img
								v-if="bucket.get(note.added_by)?.image_url"
								class="mr-2 w-6 h-6 rounded-full"
								:src="bucket.get(note.added_by)?.image_url"
								referrerPolicy="no-referrer"
								alt="User image" />
							<img
								v-else
								class="mr-2 w-6 h-6 rounded-full"
								src="~/assets/images/default-user.png"
								alt="Default user image" />
							<span
								v-if="bucket.get(note.added_by)"
								class="whitespace-nowrap"
								>{{ bucket.get(note.added_by)?.full_name }}</span
							>
							<span v-else class="whitespace-nowrap">User</span>
						</p>
						<p class="text-sm text-gray-600 dark:text-gray-400">
							<time pubdate datetime="2022-02-08" title="February 8th, 2022">{{
								note.added_at?.toLocaleString()
							}}</time>
						</p>
					</div>
					<button
						id="dropdownComment1Button"
						data-dropdown-toggle="dropdownComment1"
						class="inline-flex items-center p-2 text-sm font-medium text-center text-gray-400 rounded-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
						type="button">
						<svg
							class="w-5 h-5"
							aria-hidden="true"
							fill="currentColor"
							viewBox="0 0 20 20"
							xmlns="http://www.w3.org/2000/svg">
							<path
								d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path>
						</svg>
						<span class="sr-only">Comment settings</span>
					</button>
					<!-- Dropdown menu -->
					<div
						id="dropdownComment1"
						class="hidden z-10 w-36 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
						<ul
							class="py-1 text-sm text-gray-700 dark:text-gray-200"
							aria-labelledby="dropdownMenuIconHorizontalButton">
							<li>
								<a
									href="#"
									class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
									>Edit</a
								>
							</li>
							<li>
								<a
									href="#"
									class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
									>Remove</a
								>
							</li>
							<li>
								<a
									href="#"
									class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
									>Report</a
								>
							</li>
						</ul>
					</div>
				</footer>
				<p class="text-gray-500 dark:text-gray-400">
					{{ note.content }}
				</p>
				<div class="flex items-center mt-4 space-x-4">
					<button
						type="button"
						class="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400">
						<svg
							aria-hidden="true"
							class="mr-1 w-4 h-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
						</svg>
						Reply
					</button>
				</div>
			</article>
		</template>
		<h1 v-else-if="!canEdit" class="md:text-xl text-lg font-semibold">
			No note
		</h1>
	</section>
</template>
