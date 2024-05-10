<script setup>
	import { initModals, initDropdowns, Dropdown } from "flowbite";
	import { XMarkIcon } from "@heroicons/vue/24/outline";
	import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/vue/24/solid";

	const flag = ref(false);
	const globalStore = useGlobalStore();
	const { currentUser, getRecords } = useRealmApp();
	const { tableConfig, roles } = defineProps(["tableConfig", "roles"]);
	const { defaultSort } = tableConfig;

	const tableNameInLower = tableConfig.tableName.singular.toLowerCase();

	let primaryHeader = null;
	const tableKey = ref(0);

	const searchValue = ref(null);

	const store = tableConfig.store();

	const paginationKey = computed(() => {
		return store?.totalPages + store?.currentPage + tableKey.value;
	});

	const { saveView, activeSaveView, saveViewList } =
		tableConfig.currentRecord();

	const refreshRecordsHandle = () => {
		tableKey.value++;
	};

	tableConfig?.headers?.forEach((item) => {
		if (item.parent) {
			tableConfig.rowMap.set(item.name, {
				property: item.parent,
				visilibility: item.name,
				component: resolveComponent(item.component),
			});
		} else {
			tableConfig.rowMap.set(item.name, {
				property: item.field,
				visilibility: item.name,
				component: resolveComponent(item.component),
			});
		}

		const field = item.parent ? `${item.parent}.${item.field}` : item.field;

		if (item.auto_complete) {
			getUniqueValues(field, store.colName).then((res) => {
				if (res) {
					item.options = res.map((item) => ({ name: item, value: item }));
				}
			});
		}

		if (item.is_group) tableConfig.groupMap.set(item.name, arrangeByGroup);

		if (item.is_primary) {
			primaryHeader = item;
			if (item.parent) {
				defaultSort[`${item.parent}.${item.field}`] = 1;
			} else {
				defaultSort[item.field] = 1;
			}
		}
	});

	onBeforeMount(async () => {
		if (!currentUser) {
			navigateTo("/");
		}

		let currentRole, temp, path;

		temp = {};
		path = "collection";

		temp[path] = {};
		temp[path]["$regex"] = store.colName;
		temp[path]["$options"] = "i";
		let matchPipeline = [{ $match: temp }];

		store.initRecordsData(saveView.value.match, defaultSort);

		if (!saveViewList.value) {
			saveViewList.value = await getRecords(
				useRuntimeConfig().public.APP_DB,
				"saveView",
				matchPipeline
			);
		}

		flag.value = true;

		if (currentUser?.customData?.role && roles) {
			currentRole = roles.find(
				(item) =>
					item.name.toLowerCase() === currentUser.customData.role.toLowerCase()
			);
			if (!currentRole) navigateTo("/unauthorized");
		} else navigateTo("/unauthorized");

		tableConfig.user_role = currentRole;

		tableConfig?.headers?.forEach((item) => {
			let perm = null;

			if (item.parent) {
				perm = findFieldPermissions(item.parent, tableConfig);
			} else {
				perm = findFieldPermissions(item.field, tableConfig);
			}

			if (perm?.read !== null && item.is_visible) {
				item.is_visible = perm.read;
			}

			if (perm?.write !== null && item.is_update) {
				item.is_update = perm.write;
			}

			if (perm?.read === true && !tableConfig.read) {
				tableConfig.read = perm.read;
			}

			if (perm?.read === true && !tableConfig.write) {
				tableConfig.write = perm.write;
			}
		});

		for (const key in tableConfig.tab_headers) {
			tableConfig.tab_headers[key].read = false;
			tableConfig.tab_headers[key].write = false;

			if (tableConfig?.tab_headers[key]?.field) {
				let perm = null;
				const header = tableConfig?.tab_headers[key]?.field;

				if (header.parent) {
					perm = findFieldPermissions(header.parent, tableConfig);
				} else {
					perm = findFieldPermissions(header.field, tableConfig);
				}

				if (header.is_visible === true && perm?.read !== null) {
					header.is_visible = perm.read;
				}

				if (header.is_update === true && perm?.write !== null) {
					header.is_update = perm.write;
				}

				if (header.is_visible === true && !tableConfig?.tab_headers[key].read) {
					tableConfig.tab_headers[key].read = header.is_visible;
				}

				if (header.is_update === true && !tableConfig?.tab_headers[key].write) {
					tableConfig.tab_headers[key].write = header.is_update;
				}
			}

			tableConfig?.tab_headers[key]?.fields?.forEach((header) => {
				let perm = null;

				if (header.parent) {
					perm = findFieldPermissions(header.parent, tableConfig);
				} else {
					perm = findFieldPermissions(header.field, tableConfig);
				}

				if (header.is_visible === true && perm?.read !== null) {
					header.is_visible = perm.read;
				}

				if (header.is_update === true && perm?.write !== null) {
					header.is_update = perm.write;
				}

				if (header.is_visible === true && !tableConfig?.tab_headers[key].read) {
					tableConfig.tab_headers[key].read = header.is_visible;
				}

				if (header.is_update === true && !tableConfig?.tab_headers[key].write) {
					tableConfig.tab_headers[key].write = header.is_update;
				}
			});
		}
	});

	onMounted(() => {
		initModals();
		initDropdowns();

		if (saveView.value?.hide) {
			const { tableTdVisible } = tableConfig.hideComposable();
			tableTdVisible.value = saveView.value.hide;
		} else {
			const { tdInit } = tableConfig.hideComposable();
			tdInit(tableConfig.headers, tableConfig.tab_headers);
		}
	});

	const addRecordHandler = (data) => {
		store.addRecord(data.data, data.assign_headers, globalStore);
		refreshRecordsHandle();
	};

	watch(searchValue, async (newVal, oldVal) => {
		if (newVal === oldVal) {
			return;
		} else if (newVal?.length === 0) {
			store.currentPage = 1;
			await store.fetchData(saveView.value?.match, saveView.value?.sort);
			refreshRecordsHandle();
			return;
		}

		if (primaryHeader) {
			let temp = {};
			let path = "";
			store.currentPage = 1;
			if (primaryHeader.parent) {
				path = `${primaryHeader.parent}.${primaryHeader.field}`;
			} else path = primaryHeader.field;

			temp[path] = {};
			temp[path]["$regex"] = newVal;
			temp[path]["$options"] = "i";
			let matchPipeline = [temp];
			await store.fetchData(matchPipeline, defaultSort);
			refreshRecordsHandle();
		}
	});

	const changePage = async (changeTo) => {
		const { tableTdVisible } = tableConfig.hideComposable();

		store.currentPage = changeTo;

		if (saveView.value?.sort) {
			await store.getPage(saveView.value?.match, saveView.value?.sort);
		} else {
			await store.getPage(saveView.value?.match, defaultSort);
		}

		refreshRecordsHandle();

		if (saveView.value?.hide) {
			tableTdVisible.value = saveView.value.hide;
		}
	};

	const toggleDropdown = () => {
		let dropdownElement = document.getElementById(
			`${tableNameInLower}-saveview-dropdown`
		);

		dropdownElement.classList.toggle("hidden");

		refreshRecordsHandle();
	};

	function arrangeByGroup(data, header) {
		if (header.parent) {
			return data?.reduce((acc, user) => {
				(acc[user[header.parent][header.field]] ||= []).push(user);
				return acc;
			}, {});
		} else {
			return data?.reduce((acc, user) => {
				(acc[user[header.field]] ||= []).push(user);
				return acc;
			}, {});
		}
	}

	const recordsCount = computed(() => {
		const { singular, plural } = tableConfig.tableName;
		const suffix = store.recordsDataLength <= 1 ? singular : plural;

		return `${store.recordsDataLength} ${suffix}`;
	});

	const bulkUpdateHandler = (records) => {
		store.updateRecordsMany(records, saveView.value);
	};
</script>
<template>
	<div>
		<div v-if="flag" class="flex flex-col h-screen px-5 pt-5">
			<header class="mb-4">
				<div
					class="flex items-center justify-between max-xl:flex-col-reverse max-xl:items-start xl:gap-8 gap-4">
					<div class="flex xl:w-fit w-full items-center sm:gap-8 gap-4">
						<h2 class="text-2xl max-sm:hidden sm:inline font-bold">
							{{ recordsCount }}
						</h2>

						<div class="flex gap-2">
							<!-- HIDE Dropdown -->
							<RecordsHideDropDown
								:tabHeaders="tableConfig.tab_headers"
								:headers="tableConfig.headers"
								:hideComposable="tableConfig.hideComposable" />

							<!-- SORT Dropdown -->
							<RecordsSortDropDown
								:key="saveView?.sort"
								:data="saveView?.sort"
								:tableConfig="tableConfig"
								@sort-data="
									sortHandler($event, tableConfig, refreshRecordsHandle)
								" />

							<!-- FILTER Dropdown -->
							<RecordsFilterDropDown
								:key="saveView?.filters"
								:data="saveView?.filters"
								:tableConfig="tableConfig"
								@filter-data="
									filterHandler($event, tableConfig, refreshRecordsHandle)
								" />

							<!-- GROUP Dropdown -->
							<RecordsGroupDropDown
								:headers="tableConfig.headers"
								:groupComposable="tableConfig.groupComposable" />

							<!-- BULK-UPDATE Dropdown -->
							<RecordsUpdateSelectedDropDown
								v-if="store.selectedRecords?.length > 0"
								:key="store.selectedRecords"
								:TABLE_DATA="store.recordsData"
								:tableConfig="tableConfig"
								@update-records="bulkUpdateHandler($event)" />

							<!-- BULK-DELETE Dropdown -->
							<RecordsDeleteSelected
								v-if="
									store.selectedRecords?.length > 0 &&
									tableConfig?.user_role?.delete
								"
								@delete-record="
									store.deleteRecord(null, saveView);
									tableKey++;
								"
								:length="store.selectedRecords.length" />
						</div>
					</div>

					<div
						class="flex items-center xl:gap-8 gap-4 overflow-x-auto xl:w-fit w-full max-xl:justify-between">
						<div
							class="flex items-center max-lg:w-1/2 max-md:w-3/4 min-w-[200px]">
							<label
								for="record-search"
								class="mb-2 text-sm font-medium text-gray-900 sr-only"
								>Search</label
							>
							<div class="relative w-full max-lg:ml-14">
								<div
									class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
									<MagnifyingGlassIcon class="w-5 h-5 text-gray-500" />
								</div>
								<input
									v-model="searchValue"
									id="record-search"
									type="text"
									class="block w-full px-5 py-2.5 pl-10 text-sm text-gray-900 border-1 border-black rounded-full bg-white focus:ring-yellow-300 focus:border-primary-300"
									:placeholder="tableNameInLower" />
							</div>
						</div>
						<div class="flex items-center gap-2">
							<RecordsSaveView
								:refreshRecordsHandle="refreshRecordsHandle"
								:tableConfig="tableConfig" />

							<RecordsAdd
								v-if="tableConfig?.user_role?.insert"
								:headers="tableConfig.headers"
								:useStore="tableConfig.store"
								@add-record="addRecordHandler($event)" />
						</div>
					</div>
				</div>
			</header>

			<RecordsTable
				v-if="!store.isFetching"
				:key="tableKey"
				:TABLE_DATA="store.recordsData"
				:tableConfig="tableConfig"
				@refresh-records="refreshRecordsHandle()" />

			<RecordsTableSkeleton v-else />

			<footer class="flex items-center justify-between py-3 mt-auto">
				<Pagination
					:key="paginationKey"
					:totalPages="store.totalPages"
					:currentPage="store.currentPage"
					@change="changePage($event)" />
			</footer>
		</div>
		<div v-else class="p-4">
			<RecordsTableSkeleton :style="'max-lg:mt-20'" />
		</div>
	</div>
</template>
