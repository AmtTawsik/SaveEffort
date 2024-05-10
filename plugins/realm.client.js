import * as Realm from "realm-web";

export default defineNuxtPlugin(() => {
	const appId = useRuntimeConfig().public.APP_ID;
	const realmApp = new Realm.App(appId);

	if (realmApp.currentUser) {
		realmApp.currentUser.refreshCustomData();
	}

	return {
		provide: {
			app: realmApp,
		},
	};
});
