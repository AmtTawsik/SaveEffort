import axios from "axios";

export const useAddressApi = () => {
	const getAddressSuggestions = async (postalCode) => {
		let data;
		const apiKey = useRuntimeConfig().public.ADDRESS_API_KEY;
		const config = {
			method: "get",
			maxBodyLength: Infinity,
			url: `https://api.getAddress.io/autocomplete/${postalCode}?api-key=${apiKey}&top=20`,
		};

		await axios(config)
			.then(function (response) {
				data = response.data;
			})
			.catch(function (error) {
				console.log(error);
				data = null;
			});

		return data;
	};

	const getAddressByID = async (addressID) => {
		let data;
		const apiKey = useRuntimeConfig().public.ADDRESS_API_KEY;
		const config = {
			method: "get",
			maxBodyLength: Infinity,
			url: `https://api.getAddress.io/get/${addressID}?api-key=${apiKey}`,
		};

		await axios(config)
			.then(function (response) {
				data = response.data;
			})
			.catch(function (error) {
				console.log(error);
			});

		return data;
	};

	return { getAddressSuggestions, getAddressByID };
};
