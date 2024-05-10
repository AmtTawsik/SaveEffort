import { config, roles } from "@/table_configs/pages.json";

export const usePages = () => {
	const pages = useState("pages", () => []);
	const currentPage = useState("currentPage", () => null);

	const setPages = () => {
		const { currentUser } = useRealmApp();

		let currentRole;
		if (currentUser?.customData?.role && roles) {
			currentRole = roles.find(
				(item) =>
					item.name.toLowerCase() === currentUser.customData.role.toLowerCase()
			);
		}

		pages.value = [];
		config.forEach((page) => {
			if (currentRole?.pages && currentRole.pages[page.name] === true) {
				pages.value.push(page);
			} else if (
				currentRole?.pages &&
				currentRole.pages[page.name] !== false &&
				currentRole.visible === true
			) {
				pages.value.push(page);
			} else if (!currentRole?.pages) {
				pages.value.push(page);
			}
		});
	};

	return { currentPage, pages, setPages };
};
