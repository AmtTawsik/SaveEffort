<template>
	<section
		class="bg-white dark:bg-gray-900 h-screen flex justify-center items-center">
		<div class="p-4 max-w-screen-xl h-fit">
			<div class="mx-auto max-w-screen-sm text-center">
				<h1
					class="text-[150px] tracking-wider font-extrabold lg:text-[250px] text-primary-600 dark:text-primary-500">
					401
				</h1>
				<p
					class="mb-6 text-3xl tracking-tight font-bold text-gray-900 lg:text-6xl dark:text-white">
					Not Authorized.
				</p>
				<p class="mb-4 text-lg text-gray-500 dark:text-gray-400">
					Sorry, you are not authorized to view this page.
				</p>
				<button
					@click="loginPage"
					class="inline-flex text-white bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4">
					Back to Login page
				</button>
			</div>
		</div>
	</section>
</template>

<script setup>
	const { currentUser } = useRealmApp();

	definePageMeta({
		layout: "blank",
	});

	const loginPage = async () => {
		if (currentUser) await currentUser.logOut();
		navigateTo("/");
	};
</script>

<style scoped></style>
