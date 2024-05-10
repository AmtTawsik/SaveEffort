<script setup>
	const {
		type,
		header: __header,
		data,
	} = defineProps(["type", "header", "data"]);
	const header = reactive(__header);

	const handleInput = (__data, header) => {
		if (header.parent) {
			data[header.parent][header.field] = __data;
		} else {
			data[header.field] = __data;
		}

		if (header.is_assign_dropdown) {
			if (header.parent) {
				data[header.parent]["assigned_on"] = new Date();
			}
			header.assigned_value = __data;
		}
	};

	const fieldValue = computed(() => {
		return header.parent
			? data[header.parent][header.field]
			: data[header.field];
	});

	const isRequired = computed(() => {
		return type === "add" ? header.is_required : false;
	});
</script>

<template>
	<div class="flex flex-col gap-2">
		<label
			:for="
				data?._id
					? `${type}-${data._id.toString()}-${header.name}`
					: `${type}-${header.name}`
			"
			class="block text-base font-medium text-gray-900 dark:text-white"
			>{{ header.name }}</label
		>

		<InputChip
			v-if="header.type === 'chips'"
			:header="header"
			:fieldValue="fieldValue"
			@change="handleInput($event, header)"
			:required="isRequired" />

		<InputAssignDropdown
			v-else-if="header.is_assign_dropdown"
			:header="header"
			:fieldValue="fieldValue"
			:prefix="data?._id ? `${type}-${data._id.toString()}` : type"
			@change="handleInput($event, header)"
			:required="isRequired" />

		<InputSingleSelectDropdown
			v-else-if="header.dropdown"
			:header="header"
			:fieldValue="fieldValue"
			:prefix="data?._id ? `${type}-${data._id.toString()}` : type"
			@change="handleInput($event, header)"
			:required="isRequired" />

		<InputMultiSelectDropdown
			v-else-if="header.multi_select_dropdown"
			:header="header"
			:fieldValue="fieldValue"
			:prefix="data?._id ? `${type}-${data._id.toString()}` : type"
			@change="handleInput($event, header)"
			:required="isRequired" />

		<InputCompanyDropdown
			v-else-if="header.is_company_dropdown"
			:header="header"
			:fieldValue="fieldValue"
			:prefix="type"
			@change="handleInput($event, header)"
			:required="isRequired" />

		<InputAddressDropdown
			v-else-if="header.is_address_dropdown"
			:header="header"
			:fieldValue="fieldValue"
			:prefix="type"
			@change="handleInput($event, header)"
			:required="isRequired" />

		<div v-else-if="header.type === 'image'">
			<input
				v-if="!header.default"
				type="file"
				:name="`${type}-${header.name}`"
				:id="`${type}-${header.name}`"
				class="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full"
				accept="image/jpg, image/jpeg, image/png" />
			<div class="flex items-center" :class="!header.default ? 'mt-1' : 'mt-3'">
				<input
					v-model="header.default"
					:checked="header.default"
					id="checked-checkbox"
					type="checkbox"
					value=""
					class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
				<label
					for="checked-checkbox"
					class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
					>Use Default Image</label
				>
			</div>
		</div>

		<textarea
			v-else-if="
				header.parent === null &&
				header.dropdown === false &&
				header.type === 'textarea'
			"
			v-model="data[header.field]"
			:type="header.type"
			:name="`${type}-${header.name}`"
			:id="`${type}-${header.name}`"
			class="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
			:placeholder="header.name"
			:required="isRequired"
			:maxlength="header?.max_length && header.max_length"
			:minlength="header?.min_length && header.min_length" />

		<textarea
			v-else-if="
				header.parent !== null &&
				header.dropdown === false &&
				header.type === 'textarea' &&
				!isNullOrUndefined(data[header.parent])
			"
			v-model="data[header.parent][header.field]"
			:type="header.type"
			:name="`${type}-${header.name}`"
			:id="`${type}-${header.name}`"
			class="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
			:placeholder="header.name"
			:required="isRequired" />

		<input
			v-else-if="
				header.parent === null &&
				header.dropdown === false &&
				header.type !== 'textarea'
			"
			v-model="data[header.field]"
			:type="header.type"
			:name="`${type}-${header.name}`"
			:id="`${type}-${header.name}`"
			:step="header.step ? header.step : 'any'"
			class="text bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
			:placeholder="header.name"
			:required="isRequired"
			:maxlength="header?.max_length && header.max_length"
			:minlength="header?.min_length && header.min_length" />

		<input
			v-else-if="
				header.parent !== null &&
				header.dropdown === false &&
				header.type !== 'textarea' &&
				!isNullOrUndefined(data[header.parent])
			"
			v-model="data[header.parent][header.field]"
			:type="header.type"
			:name="`${type}-${header.name}`"
			:id="`${type}-${header.name}`"
			:step="header.step ? header.step : 'any'"
			class="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
			:placeholder="header.name"
			:required="isRequired" />
	</div>
</template>
