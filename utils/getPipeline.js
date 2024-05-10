import { BSON } from "realm-web";

export default async (filters) => {
	if (!filters) return null;

	const globalStore = useGlobalStore();

	let matchPipeline = [];

	for (let index = 0; index < filters.length; index++) {
		const item = filters[index];

		let temp = {};
		let path = "";

		if (item?.selectHeader?.is_assign_dropdown) {
			const fromHeader = item?.selectHeader;
			const fromStore = globalStore[fromHeader.get_from].useStore();

			const res = await fromStore.findByField(
				fromHeader.get_from_field,
				item.operand
			);

			if (res) {
				path = item.selectHeader.field;
				let operand = "";

				if (fromHeader.get_from_value === "_id") {
					operand = BSON.ObjectID(res[fromHeader.get_from_value]);
				} else operand = res[fromHeader.get_from_value];

				temp[path] = {};
				temp[path][item?.operator] = operand;
				matchPipeline.push(temp);
			} else {
				path = item.selectHeader.field;

				temp[path] = {};
				temp[path][item?.operator] = null;
				matchPipeline.push(temp);
			}

			if (index === filters.length - 1) {
				return matchPipeline.length > 0 ? matchPipeline : null;
			}
		} else {
			if (item.selectHeader.type === "pipeline") {
				path = `${item?.selectHeader?.field}.current_stage`;
			} else if (item?.selectHeader?.parent) {
				path = `${item?.selectHeader?.parent}.${item?.selectHeader?.field}`;
			} else path = item?.selectHeader?.field;

			temp[path] = {};
			if (item.selectHeader.type === "date") {
				// TODO: @Handle date
				const date = new Date(item?.operand);
				temp[path][item?.operator] = date;
			} else temp[path][item?.operator] = item?.operand;
			matchPipeline.push(temp);

			if (index === filters.length - 1) {
				return matchPipeline.length > 0 ? matchPipeline : null;
			}
		}
	}
};
