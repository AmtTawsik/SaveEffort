export default defineNuxtConfig({
	css: ["@/assets/css/main.css"],
	runtimeConfig: {
		public: {
			APP_ID: process.env.VITE_REALM_APP_ID,
			APP_NAME: process.env.VITE_APP_NAME,
			APP_DB: process.env.VITE_REALM_DB,
			APP_UTILITY_COLLECTION: process.env.VITE_REALM_UTILITY_COLLECTION,
			APP_TESTING: process.env.VITE_APP_TESTING,
			USER_API_KEY: process.env.VITE_USER_API_KEY,
			ADMIN_API_KEY: process.env.VITE_ADMIN_API_KEY,
			ADDRESS_API_KEY: process.env.VITE_ADDRESS_API_KEY,
			COMPANY_HOUSE_API_KEY: process.env.VITE_COMPANY_HOUSE_API_KEY,
			S3_BUCKET_NAME: process.env.VITE_S3_BUCKET_NAME,
			S3_REGION: process.env.VITE_S3_REGION,
			S3_ACCESS_KEY: process.env.VITE_S3_ACCESS_KEY,
			S3_SECRET_ACCESS_KEY: process.env.VITE_S3_SECRET_ACCESS_KEY,
			USER_IMAGE: process.env.VITE_USER_IMAGE,
		},
	},

	app: {
		head: {
			meta: [
				{ name: "viewport", content: "width=device-width, initial-scale=1" },
			],
			script: [
				{
					src: "https://sdk.amazonaws.com/js/aws-sdk-2.726.0.min.js",
				},
			],
			title: process.env.VITE_APP_NAME,
			link: [
				{ rel: "icon", type: "image/svg+xml", href: "/logo-saveefforts-2.png" },
			],
		},
	},

	components: {
		global: true,
		dirs: ["~/components"],
	},

	alias: {
		pinia: "/node_modules/@pinia/nuxt/node_modules/pinia/dist/pinia.mjs",
	},

	pinia: {
		autoImports: ["defineStore", "acceptHMRUpdate"],
	},

	plugins: ["~/plugins/realm.client.js"],
	modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt"],
});
