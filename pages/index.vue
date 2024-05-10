<template>
	<div>
		<section class="bg-gray-50 dark:bg-gray-900 flex justify-center h-screen">
			<div class="flex flex-col gap-6 px-6 py-8 mx-auto items-center">
				<h1
					class="md:text-4xl sm:text-3xl text-2xl font-extrabold leading-tight tracking-wide text-gray-900 dark:text-white text-center">
					Welcome back to, {{ APP_NAME }} !
				</h1>
				<div
					class="flex justify-center items-center h-full w-full sm:max-w-md xl:p-0">
					<div
						class="bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-lg shadow p-4 sm:p-6 w-full">
						<h1
							class="text-xl font-semibold leading-tight tracking-wide text-gray-900 md:text-2xl dark:text-white mb-8 text-center">
							Login, to continue
						</h1>
						<button
							@click="googleLogin"
							type="submit"
							class="flex w-full items-center justify-center gap-4 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm p-2.5 text-center">
							<div class="bg-white md:p-2 p-1 rounded-full shadow">
								<img
									src="@/assets/images/google.png"
									alt="Google Logo"
									width="15" />
							</div>
							<p class="font-semibold text-base md:text-xl mr-2">
								Sign in with Google
							</p>
						</button>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>

<script setup>
	const { app, Realm } = useRealmApp();
	const { APP_NAME } = useRuntimeConfig().public;
	const { currentUser, loginApiKey } = useRealmApp();
	const { pages, setPages } = usePages();

	onBeforeMount(async () => {
		if (currentUser) {
			await setPages();
			if (pages.value?.length > 1) {
				navigateTo(pages.value[0].to);
			} else navigateTo("/unauthorized");
		}
	});

	definePageMeta({
		layout: "blank",
	});

	const googleLogin = () => {
		const { APP_TESTING } = useRuntimeConfig().public;

		if (APP_TESTING) {
			loginApiKey().then(async (user) => {
				await user.refreshProfile();
				await user.refreshCustomData();
				await setPages();
				if (pages.value?.length > 0) {
					navigateTo(pages.value[0].to);
				} else navigateTo("/unauthorized");
			});
		} else {
			// Code for google auth
			const redirectURI = `${window.location.protocol}//${window.location.host}/callback`;
			const credentials = Realm.Credentials.google({
				redirectUrl: redirectURI,
			});
			app
				.logIn(credentials)
				.then(async (user) => {
					await user.refreshProfile();
					await user.refreshCustomData();
					await setPages();
					if (pages.value?.length > 0) {
						navigateTo(pages.value[0].to);
					} else navigateTo("/unauthorized");
				})
				.catch((err) => console.error(err));
		}
	};
</script>

<style scoped></style>
