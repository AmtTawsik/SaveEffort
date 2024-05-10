export default defineNuxtRouteMiddleware((to, from) => {
	const { currentPage } = usePages();
	currentPage.value = to.fullPath;
});
