import * as __contactStore from "~/stores/contact";
import * as __companyStore from "~/stores/company";
import * as __dealStore from "~/stores/deal";
import * as __taskStore from "~/stores/task";
import * as __userStore from "~/stores/user";
import * as __personStore from "~/stores/person";
import * as __projectStore from "~/stores/project";
import * as __leadStore from "~/stores/lead";
import * as __uniqueValuesStore from "~/stores/unique_values";

export const useGlobalStore = () => {
	const contactStore = __contactStore;
	const companyStore = __companyStore;
	const dealStore = __dealStore;
	const taskStore = __taskStore;
	const userStore = __userStore;
	const personStore = __personStore;
	const projectStore = __projectStore;
	const leadStore = __leadStore;
	const uniqueValuesStore = __uniqueValuesStore;

	return {
		contactStore,
		companyStore,
		dealStore,
		taskStore,
		userStore,
		personStore,
		projectStore,
		leadStore,
		uniqueValuesStore,
	};
};
