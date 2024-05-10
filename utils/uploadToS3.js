let s3,
	isConfigUpdate = false;

const AWSsetup = (credentials) => {
	if (!window.AWS) {
		return;
	}
	if (!isConfigUpdate) {
		window.AWS.config.update({ region: credentials.region });
		isConfigUpdate = true;
	}

	s3 = new window.AWS.S3({
		credentials: new window.AWS.Credentials({
			apiVersion: "latest",
			accessKeyId: credentials.accressKeyId,
			secretAccessKey: credentials.secretAccessKey,
			signatureVersion: credentials.signatureVersion,
			region: credentials.region,
			Bucket: credentials.Bucket,
		}),
	});
};

export default async (credentials, stream, fileType, cd) => {
	AWSsetup(credentials);

	try {
		const fileKey = getHexaNum(16);
		let uploadedItem = await s3
			.upload({
				Bucket: credentials.Bucket,
				Key: fileKey, // name for the bucket file
				ContentType: fileType,
				Body: stream,
			})
			.on("httpUploadProgress", function (progress) {
				console.log("progress=>", progress);
				// cd(getUploadingProgress(progress.loaded, progress.total));
			})
			.promise();

		return uploadedItem;
	} catch (error) {
		console.log(error);
	}
};
