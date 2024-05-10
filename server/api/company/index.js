import axios from "axios";

export default defineEventHandler(async (event) => {
	let data;
	const { name } = getQuery(event);
	const { COMPANY_HOUSE_API_KEY } = useRuntimeConfig().public;

	var config = {
		method: "get",
		maxBodyLength: Infinity,
		url: `https://api.company-information.service.gov.uk/advanced-search/companies?company_name_includes=${name}&company_status=active`,
		headers: {
			Authorization: `Basic ${COMPANY_HOUSE_API_KEY}`,
		},
	};

	await axios(config)
		.then((response) => {
			console.log(response.data);
			data = response.data;
		})
		.catch((error) => {
			console.log(error);
		});

	return {
		data,
	};
});
