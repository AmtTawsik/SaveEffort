<script setup>
	import {
		ChevronDownIcon,
		PlusCircleIcon,
		WalletIcon,
	} from "@heroicons/vue/24/solid";
	import {
		ChatBubbleBottomCenterTextIcon,
		ChevronDoubleRightIcon,
		TrashIcon,
	} from "@heroicons/vue/24/outline";

	const { S3_ACCESS_KEY, S3_SECRET_ACCESS_KEY, S3_BUCKET_NAME, S3_REGION } =
		useRuntimeConfig().public;
	const { data, canEdit } = defineProps(["data", "canEdit"]);
	const emit = defineEmits(["updateRecord"]);
	const { currentUser } = useRealmApp();
	const isUploading = ref(false);

	let isConfigUpdate = false;
	let s3 = null;
	let s3Credentials = {
		accressKeyId: S3_ACCESS_KEY,
		secretAccessKey: S3_SECRET_ACCESS_KEY,
		signatureVersion: "v4",
		region: S3_REGION,
		Bucket: S3_BUCKET_NAME,
	};

	onBeforeMount(() => {
		if (!window.AWS) {
			return;
		}
		if (!isConfigUpdate) {
			window.AWS.config.update({ region: s3Credentials.region });
			isConfigUpdate = true;
		}

		s3 = new window.AWS.S3({
			credentials: new window.AWS.Credentials({
				apiVersion: "latest",
				accessKeyId: s3Credentials.accressKeyId,
				secretAccessKey: s3Credentials.secretAccessKey,
				signatureVersion: s3Credentials.signatureVersion,
				region: s3Credentials.region,
				Bucket: s3Credentials.Bucket,
			}),
		});
	});

	const updateRecordHandler = async (data, fileName, uploadedFile) => {
		const { currentUser } = useRealmApp();
		const field = "documents";
		let set_data = {};

		set_data[field] = data[field];

		if (set_data[field]?.length > 0) {
			set_data[field].push({
				name: fileName.name,
				size: fileName.size,
				type: fileName.type,
				s3: uploadedFile,
			});
		} else {
			set_data[field] = [
				{
					name: fileName.name,
					size: fileName.size,
					type: fileName.type,
					s3: uploadedFile,
				},
			];
		}

		data[field] = set_data[field];

		if (!data.update_logs || data.update_logs.length === 0)
			data.update_logs = [];

		data.update_logs.push({
			type: "add",
			field: "documents",
			to: fileName.name,
			updated_at: new Date(),
			updated_by: currentUser?.id,
		});

		set_data.update_logs = data.update_logs;
		emit("updateRecord", { set: set_data, data: data });
	};

	const getSignedUrl = async (item) => {
		const signedUrl = await s3.getSignedUrlPromise("getObject", {
			Bucket: item.Bucket,
			Key: item.Key,
			Expires: null,
		});

		if (signedUrl) window.open(signedUrl);
	};

	async function uploadToS3Bucket(stream, bucketName, fileType, cd) {
		try {
			const fileKey = getHexaNum(16);
			let uploadItem = await s3
				.upload({
					Bucket: bucketName,
					Key: fileKey, // name for the bucket file
					ContentType: fileType,
					Body: stream,
				})
				.on("httpUploadProgress", function (progress) {
					cd(getUploadingProgress(progress.loaded, progress.total));
				})
				.promise();

			return uploadItem;
		} catch (error) {
			console.log(error);
		}
	}

	function getUploadingProgress(uploadSize, totalSize) {
		let uploadProgress = (uploadSize / totalSize) * 100;
		return Number(uploadProgress.toFixed(0));
	}

	async function uploadMedia(data) {
		isUploading.value = true;
		const fileName = document.getElementById("fileToUpload").files[0];
		if (!fileName) return;

		let mediaStreamRequest = getFile(fileName);
		const [mediaStream] = await Promise.all([mediaStreamRequest]);

		const uploadedFile = await uploadToS3Bucket(
			mediaStream,
			s3Credentials.Bucket,
			fileName.type,
			(progress) => {
				console.log(progress);
			}
		);

		if (uploadedFile) updateRecordHandler(data, fileName, uploadedFile);
		isUploading.value = false;
	}

	const deleteDocument = (data, index) => {
		const field = "documents";
		const set_data = {};

		if (!canEdit) return;

		if (!data.update_logs || data.update_logs.length === 0)
			data.update_logs = [];

		data.update_logs.push({
			type: "delete",
			field: "documents",
			to: data[field][index].name,
			updated_at: new Date(),
			updated_by: currentUser?.id,
		});

		set_data.update_logs = data.update_logs;

		if (data[field]?.length > 0) data[field].splice(index, 1);

		set_data[field] = data[field];

		emit("updateRecord", { set: set_data, data: data });
	};
</script>

<template>
	<div v-if="data" class="flex flex-col gap-4">
		<div v-if="canEdit" class="flex items-end gap-4">
			<div class="flex flex-col gap-4">
				<label
					class="block md:text-xl text-lg font-semibold text-gray-900 dark:text-white"
					for="fileToUpload"
					>Upload a new file</label
				>
				<input
					@change="uploadMedia(data)"
					class="block w-full text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
					id="fileToUpload"
					type="file"
					required />
			</div>
		</div>
		<div class="flex flex-col gap-4">
			<h1
				v-if="data?.documents?.length > 1"
				class="md:text-xl text-lg font-semibold">
				{{ data.documents.length }} Documents
			</h1>
			<h1
				v-else-if="data?.documents?.length === 1"
				class="md:text-xl text-lg font-semibold">
				{{ data.documents.length }} Document
			</h1>
			<h1 v-else class="md:text-xl text-lg font-semibold">No document</h1>
			<template v-for="(doc, index) in data.documents" :key="doc.name">
				<div
					class="flex border border-gray-300 py-2 px-3 rounded-lg gap-4 justify-between items-center">
					<div class="flex gap-4 justify-between w-full">
						<h1
							class="cursor-pointer hover:text-primary-400"
							@click="getSignedUrl(doc.s3)">
							{{ doc.doc_type ? doc.doc_type : doc.name }}
						</h1>
						<h2 v-if="doc.size / 1024 < 1">{{ doc.size }} bytes</h2>
						<h2 v-else>{{ (doc.size / 1024).toFixed(1) }} Kb</h2>
					</div>
					<button
						v-if="canEdit"
						@click="deleteDocument(data, index)"
						class="inline-flex justify-center items-center w-fit h-fit p-2 rounded-full text-red-500 hover:bg-red-500 hover:text-white aspect-square"
						type="button">
						<TrashIcon class="w-5 h-5" />
					</button>
				</div>
			</template>
			<div
				v-if="isUploading"
				role="status"
				class="flex justify-between items-center border border-gray-300 p-5 rounded-lg animate-pulse dark:border-gray-700">
				<div class="w-60 h-2.5 bg-gray-300 rounded-full dark:bg-gray-700"></div>
				<div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-32"></div>
				<span class="sr-only">Loading...</span>
			</div>
		</div>
	</div>
</template>
