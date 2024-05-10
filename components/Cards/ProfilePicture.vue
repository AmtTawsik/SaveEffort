<template>
	<div class="relative flex justify-center">
		<img
			v-if="image"
			class="w-20 h-20 rounded-full object-cover"
			:src="image"
			alt="User image" />
		<img
			v-else
			class="w-20 h-20 rounded-full object-cover"
			src="~/assets/images/default-user.png"
			alt="Defaut user" />
		<label
			for="changeProfilePicture"
			class="flex gap-1 absolute p-1.5 -bottom-4 bg-white rounded-3xl shadow cursor-pointer text-gray-600">
			<CameraIcon class="w-4 h-4" />
		</label>
		<input
			id="changeProfilePicture"
			type="file"
			@change="uploadMedia()"
			accept="image/jpg, image/jpeg, image/png"
			class="hidden" />
	</div>
</template>

<script setup>
	import { CameraIcon } from "@heroicons/vue/24/solid";
	import { initPopovers } from "flowbite";

	const { S3_ACCESS_KEY, S3_SECRET_ACCESS_KEY, S3_BUCKET_NAME, S3_REGION } =
		useRuntimeConfig().public;
	const { image } = defineProps(["image"]);
	const emit = defineEmits(["uploaded"]);
	const isUploading = ref(false);

	let s3Credentials = {
		accressKeyId: S3_ACCESS_KEY,
		secretAccessKey: S3_SECRET_ACCESS_KEY,
		signatureVersion: "v4",
		region: S3_REGION,
		Bucket: S3_BUCKET_NAME,
	};

	onMounted(() => {
		initPopovers();
	});

	async function uploadMedia() {
		isUploading.value = true;
		const fileName = document.getElementById("changeProfilePicture").files[0];
		console.log(fileName);
		if (!fileName) return;

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

		isUploading.value = false;
		if (uploadedFile) emit("uploaded", uploadedFile);
	}
</script>

<style lang="scss" scoped></style>
