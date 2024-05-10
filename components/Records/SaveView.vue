<template>
	<div>
		<button
			:id="`${tableNameInLower}-saveview-dropdown-button`"
			:data-dropdown-toggle="`${tableNameInLower}-saveview-dropdown`"
			class="primary-button !gap-4 max-md:p-2.5 max-md:border-2 border-primary-400"
			type="button">
			<BookmarkIcon
				class="w-4 h-4 font-semibold md:hidden max-md:w-5 max-md:h-5" />
			<span class="max-md:hidden">{{
				activeSaveView?.name ? activeSaveView.name : "Save view"
			}}</span>
			<ChevronDownIcon class="w-4 h-4 max-md:hidden" />
		</button>
		<!-- Dropdown menu -->
		<div
			:id="`${tableNameInLower}-saveview-dropdown`"
			class="z-10 hidden bg-white divide-y divide-gray-100 rounded-md shadow w-fit text-sm">
			<div
				v-if="activeSaveView"
				class="flex justify-between items-center px-3 py-2 gap-2 text-gray-900">
				<h2 class="font-medium">
					{{ activeSaveView?.name ? activeSaveView.name : "Save view" }}
				</h2>
				<button
					class="hover:bg-gray-200 rounded-full p-1"
					@click="clearSaveView(tableConfig, toggleDropdown)">
					<XMarkIcon class="w-4 h-4" />
				</button>
			</div>
			<ul
				v-if="saveViewList?.length > 0 && !store.isFetching"
				class="py-1 text-gray-700 text-center"
				:aria-labelledby="`${tableNameInLower}-saveview-dropdown-button`">
				<li
					@click="applySaveView(tableConfig, item, toggleDropdown)"
					v-for="item in saveViewList"
					:key="item._id">
					<a class="block px-2 py-2 hover:bg-gray-100 cursor-pointer">{{
						item.name
					}}</a>
				</li>
			</ul>
			<Spinner
				v-else-if="store.isFetching"
				class="flex p-2 items-center justify-center" />
			<div class="p-2">
				<button
					@click="saveViewModal?.show()"
					id="saveview-button"
					class="primary-button-sm w-full">
					<PlusIcon class="w-4 h-4 max-md:w-5 max-md:h-5" />
					Add new
				</button>
			</div>
		</div>
		<div
			id="saveView-modal"
			tabindex="-1"
			aria-hidden="true"
			class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
			<div class="relative w-full max-w-md max-h-full">
				<!-- Modal content -->
				<div class="relative bg-white rounded-lg shadow">
					<button
						@click="saveViewModal?.hide()"
						type="button"
						class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
						<XMarkIcon class="w-5 h-5" />
						<span class="sr-only">Close modal</span>
					</button>
					<div class="px-6 py-6 lg:px-8">
						<h3 class="mb-4 text-xl font-medium text-gray-900">Save view</h3>
						<div class="space-y-6" action="#">
							<div>
								<label
									for="saveview-name"
									class="block mb-2 text-sm font-medium text-gray-900"
									>Template name</label
								>
								<input
									type="text"
									name="saveview-name"
									id="saveview-name"
									v-model="saveViewName"
									class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
									placeholder="Name"
									required />
							</div>

							<button
								@click="
									addSaveView(tableConfig, saveViewName, clearSaveViewName);
									saveViewModal?.hide();
								"
								type="submit"
								class="w-full text-gray-800 bg-primary-400 hover:bg-primary-500 focus:ring-4 focus:outline-none focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
								Save
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { initDropdowns } from "flowbite";
	import {
		ChevronDownIcon,
		XMarkIcon,
		BookmarkIcon,
	} from "@heroicons/vue/24/outline";

	import { PlusIcon } from "@heroicons/vue/24/solid";

	const { refreshRecordsHandle, tableConfig } = defineProps([
		"refreshRecordsHandle",
		"tableConfig",
	]);
	const tableNameInLower = tableConfig.tableName.singular.toLowerCase();
	const { saveView, activeSaveView, saveViewList } =
		tableConfig.currentRecord();
	const store = tableConfig.store();
	const saveViewName = ref("");
	const saveViewModal = ref(null);

	const createModal = () => {
		const modalElement = document.querySelector("#saveView-modal");

		const modalOptions = {
			placement: "center",
			backdrop: "dynamic",
			backdropClasses: "bg-gray-900/40 fixed inset-0 z-40",
			closable: true,
		};

		if (modalElement) {
			saveViewModal.value = new Modal(modalElement, modalOptions);
		}
	};

	const toggleDropdown = () => {
		let dropdownElement = document.getElementById(
			`${tableNameInLower}-saveview-dropdown`
		);

		dropdownElement.classList.toggle("hidden");

		refreshRecordsHandle();
	};

	onMounted(() => {
		initDropdowns();
		createModal();

		if (saveView.value?.hide) {
			const { tableTdVisible } = tableConfig.hideComposable();
			tableTdVisible.value = saveView.value.hide;
		} else {
			const { tdInit } = tableConfig.hideComposable();
			tdInit(tableConfig.headers, tableConfig.tab_headers);
		}
	});

	const clearSaveViewName = () => {
		saveViewName.value = "";
	};
</script>
