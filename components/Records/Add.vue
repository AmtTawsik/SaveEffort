<script setup>
	import { Modal } from "flowbite";
	import { XMarkIcon } from "@heroicons/vue/24/outline";
	import { PlusIcon } from "@heroicons/vue/24/solid";

	const { currentUser } = useRealmApp();
	const { S3_ACCESS_KEY, S3_SECRET_ACCESS_KEY, S3_BUCKET_NAME, S3_REGION } =
		useRuntimeConfig().public;

	const newRecord = ref(null);
	const assign_headers = ref([]);
	const addModal = ref(null);

	const emit = defineEmits(["addRecord"]);
	const { headers, useStore } = defineProps(["headers", "useStore"]);

	const store = useStore();

	let s3Credentials = {
		accressKeyId: S3_ACCESS_KEY,
		secretAccessKey: S3_SECRET_ACCESS_KEY,
		signatureVersion: "v4",
		region: S3_REGION,
		Bucket: S3_BUCKET_NAME,
	};

	const createModal = () => {
		const modalElement = document.querySelector("#addRecord-modal");

		const modalOptions = {
			placement: "center",
			backdrop: "dynamic",
			backdropClasses: "bg-gray-900/40 fixed inset-0 z-40",
			closable: true,
		};

		if (modalElement) {
			addModal.value = new Modal(modalElement, modalOptions);
		}
	};

	const initNewRecord = () => {
		newRecord.value = {};

		headers?.forEach((element) => {
			if (element.type === "image") {
				element.default = true;
			}
			if (
				(element.is_add || !isNullOrUndefined(element.default_value)) &&
				element.parent
			) {
				if (!newRecord.value[element.parent])
					newRecord.value[element.parent] = {};

				if (!isNullOrUndefined(element.default_value))
					newRecord.value[element.parent][element.field] =
						element.default_value;
				else newRecord.value[element.parent][element.field] = "";
			} else if (
				(element.is_add || !isNullOrUndefined(element.default_value)) &&
				!element.parent
			) {
				if (!isNullOrUndefined(element.default_value))
					newRecord.value[element.field] = element.default_value;
				else {
					newRecord.value[element.field] = "";
				}
			}
		});
	};

	initNewRecord();

	const addNewRecord = async () => {
		let uploadImageHeader = null;
		store.isAdding = true;

		await headers?.forEach(async (header) => {
			if (header.is_assign_dropdown && header.assign_to_field)
				assign_headers.value.push(header);

			if (header.type === "image") {
				uploadImageHeader = header;
			} else if (header?.type === "date") {
				if (!header?.parent && newRecord.value[header.field]) {
					const fieldValue = newRecord.value[header.field];
					newRecord.value[header.field] =
						fieldValue.trim() === "" ? "" : new Date(fieldValue);
				}

				if (
					header?.parent &&
					newRecord.value[header.parent] &&
					newRecord.value[header.parent][header.field]
				) {
					const fieldValue = newRecord.value[header.parent][header.field];
					newRecord.value[header.parent][header.field] =
						fieldValue.trim() === "" ? "" : new Date(fieldValue);
				}
			} else if (header.type === "pipeline") {
				newRecord.value[header.field] = {
					stages: [],
					current_stage: 0,
					assignee: "",
					owner: "",
					notes: [],
				};

				header.stages?.forEach((item) => {
					newRecord.value[header.field].stages.push({
						name: item,
						date: null,
						description: "",
						comment: "",
					});
				});

				newRecord.value[header.field].stages[0].date = new Date();
			}

			if (header.combine) {
				if (!newRecord.value[header.field]) {
					newRecord.value[header.field] = "";
				}

				newRecord.value[header.field] = header.combine
					.reduce(
						(result, item) => result.concat(" ", newRecord.value[item]),
						""
					)
					.trim();
			}
		});

		newRecord.value.created_at = new Date();
		newRecord.value.created_by = currentUser?.id;

		if (uploadImageHeader && !uploadImageHeader.default) {
			const fileName = document.getElementById(`add-${uploadImageHeader.name}`)
				.files[0];

			if (fileName) {
				let mediaStreamRequest = getFile(fileName);
				const [mediaStream] = await Promise.all([mediaStreamRequest]);

				const uploadedFile = await uploadToS3(
					s3Credentials,
					mediaStream,
					fileName.type,
					(progress) => {
						console.log(progress);
					}
				);

				if (uploadedFile)
					newRecord.value[uploadImageHeader.field] = uploadedFile.Location;

				emit("addRecord", {
					data: newRecord.value,
					assign_headers: assign_headers.value,
				});
				initNewRecord();
			}
		} else {
			newRecord.value.image_url = useRuntimeConfig().public.USER_IMAGE;
			emit("addRecord", {
				data: newRecord.value,
				assign_headers: assign_headers.value,
			});
			initNewRecord();
		}

		addModal.value?.hide();
	};

	onMounted(() => {
		createModal();
	});
</script>

<template>
	<div>
		<button
			@click="addModal?.show()"
			id="addRecordButton"
			class="flex items-center gap-1 border-2 rounded-md border-black px-5 py-[.54rem] max-md:p-2.5 min-w-max hover:border-yellow-400">
			<PlusIcon class="w-4 h-4 font-semibold max-md:w-5 max-md:h-5" />
			<span class="text-sm font-medium max-md:hidden">Add Record</span>
		</button>
		<div
			id="addRecord-modal"
			tabindex="-1"
			aria-hidden="true"
			class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full">
			<div class="relative p-4 w-full max-w-4xl h-full md:h-auto">
				<!-- Modal content -->
				<div
					class="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
					<!-- Modal header -->
					<div
						class="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
						<h3 class="text-xl font-semibold text-gray-900 dark:text-white">
							Add Record
						</h3>
						<button
							@click="addModal?.hide()"
							type="button"
							class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
							<XMarkIcon class="w-5 h-5" />
							<span class="sr-only">Close modal</span>
						</button>
					</div>
					<!-- Modal body -->
					<form
						id="add-record-form"
						action="#"
						@keypress.enter.prevent
						@submit.prevent="addNewRecord()">
						<div
							class="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 mb-8">
							<template v-for="(header, index) in headers" :key="index">
								<InputFields
									v-if="header.is_add"
									:key="newRecord"
									type="add"
									:header="header"
									:data="newRecord" />
							</template>
						</div>
						<button class="primary-button">Add record</button>
					</form>
				</div>
			</div>
		</div>
	</div>
</template>
