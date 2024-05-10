<script setup>
	import { BSON } from "realm-web";
	import { Modal } from "flowbite";

	const { id, composable, headers } = defineProps([
		"id",
		"composable",
		"headers",
	]);

	const flag = ref(false);
	const recordData = ref(null);
	const globalStore = useGlobalStore();
	const { currRecord, updateModal } = composable();

	const emit = defineEmits(["updateRecord"]);

	const createUpdateModal = () => {
		const modalElement = document.querySelector("#update-modal");

		const modalOptions = {
			placement: "center",
			backdrop: "dynamic",
			backdropClasses: "bg-gray-900/40 fixed inset-0 z-40",
			closable: true,

			onHide: () => {
				currRecord.value = null;
			},
		};

		// create a new modal instance
		if (modalElement) {
			updateModal.value = new Modal(modalElement, modalOptions);
		}
	};

	onMounted(() => {
		createUpdateModal();
	});

	const initRecord = () => {
		recordData.value = JSON.parse(JSON.stringify(currRecord.value));
		recordData.value._id = BSON.ObjectID(recordData.value._id);

		headers.forEach(async (header) => {
			if (header.parent && !recordData.value[header.parent]) {
				recordData.value[header.parent] = {};
			}

			if (header.dropdown && !header.options && header.get_from) {
				const store = globalStore[header.get_from].useStore();

				header.options = [];

				if (store.recordsData === null) {
					await store.initRecordsData().then((data) => {
						data.forEach((item) => {
							header.options.push({
								name: item[header.get_from_field],
								value: JSON.parse(JSON.stringify(item[header.get_from_value])),
							});
						});
					});
				} else {
					store.recordsData.forEach((item) => {
						header.options.push({
							name: item[header.get_from_field],
							value: JSON.parse(JSON.stringify(item[header.get_from_value])),
						});
					});
				}
			}

			if (header?.type === "date") {
				const fieldToFormat = header.parent
					? recordData.value[header.parent][header.field]
					: recordData.value[header.field];

				if (fieldToFormat) {
					let formattedDate = formatHtmlDate(fieldToFormat);

					if (header.parent) {
						recordData.value[header.parent][header.field] = formattedDate;
					} else {
						recordData.value[header.field] = formattedDate;
					}
				}
			}
		});

		flag.value = true;
	};

	watch(currRecord, (newVal) => {
		if (newVal) initRecord();
	});

	if (currRecord.value) initRecord();
	else flag.value = true;
</script>

<template>
	<div
		id="update-modal"
		tabindex="-1"
		aria-hidden="true"
		class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full">
		<div class="relative p-4 w-full max-w-2xl h-full md:h-auto">
			<!-- Modal content -->
			<div
				class="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
				<!-- Modal header -->
				<div
					class="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
					<h3 class="text-xl font-semibold text-gray-900 dark:text-white">
						Edit Record
					</h3>
					<button
						@click="updateModal?.hide()"
						type="button"
						class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
						<svg
							aria-hidden="true"
							class="w-5 h-5"
							fill="currentColor"
							viewBox="0 0 20 20"
							xmlns="http://www.w3.org/2000/svg">
							<path
								fill-rule="evenodd"
								d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
								clip-rule="evenodd"></path>
						</svg>
						<span class="sr-only">Close modal</span>
					</button>
				</div>
				<!-- Modal body -->
				<form
					v-if="recordData"
					id="update-record-form"
					action="#"
					@keypress.enter.prevent
					@submit.prevent="
						updateRecordHandler(currRecord, recordData, headers, emit);
						updateModal?.hide();
					">
					<div class="grid gap-4 mb-8 sm:grid-cols-2">
						<template v-for="(header, index) in headers" :key="index">
							<InputFields
								v-if="header.is_update"
								:key="currRecord"
								:header="header"
								:data="recordData"
								type="update" />
						</template>
					</div>
					<button class="primary-button">Update record</button>
				</form>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped></style>
