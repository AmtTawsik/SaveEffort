<script setup>
	const { tab, content, id } = defineProps(["tab", "content", "id"]);
	const { currRecord } = content.currentRecord();
	const toStore = content.store();

	const ndaRegion = ref("");

	const detailsUpdateHandler = (event) => {
		if (event?.set && event?.data) {
			toStore.addField(event.set, event.data);
		}
	};
</script>

<template>
	<div
		v-if="tab.read"
		class="hidden p-4 rounded-lg"
		:id="`${id}`"
		role="tabpanel"
		:aria-labelledby="`${id}-tab`">
		<SideDrawerTabsDetails
			v-if="tab.type === 'detail'"
			:key="currRecord"
			:data="currRecord"
			:headers="tab.fields"
			:header="tab.field"
			:canEdit="tab.write"
			@update-record="detailsUpdateHandler($event)" />

		<SideDrawerTabsHistory
			v-else-if="tab.type === 'history'"
			:key="currRecord"
			:data="currRecord"
			:canEdit="tab.write"
			:headers="content.headers" />

		<SideDrawerTabsPipeline
			v-else-if="tab.type === 'pipeline'"
			:key="currRecord"
			:data="currRecord"
			:header="tab.field"
			:canEdit="tab.write"
			:pipelineField="tab.pipeline_field"
			@update-record="detailsUpdateHandler($event)" />

		<SideDrawerTabsChips
			v-else-if="tab.type === 'chip'"
			:key="currRecord"
			:data="currRecord"
			:header="tab.field"
			:canEdit="tab.write"
			@update-record="detailsUpdateHandler($event)" />

		<SideDrawerTabsNotes
			v-else-if="tab.type === 'note'"
			:key="currRecord"
			:data="currRecord"
			:canEdit="tab.write"
			@update-record="detailsUpdateHandler($event)" />

		<SideDrawerTabsDocuments
			v-else-if="tab.type === 'document'"
			:key="currRecord"
			:data="currRecord"
			:canEdit="tab.write"
			@update-record="detailsUpdateHandler($event)" />

		<SideDrawerTabsAssign
			v-else-if="tab.type === 'assign'"
			:key="currRecord"
			:data="currRecord"
			:canEdit="tab.write"
			:header="tab.field"
			:startDate="tab.start_date"
			:endDate="tab.end_date"
			:percentageAllocation="tab.percentage_alloaction"
			:store="toStore" />

		<div v-else class="flex flex-col gap-4">
			<div class="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
				<div class="flex flex-col gap-2">
					<label
						for="sign-nda"
						class="block text-base font-medium text-gray-900"
						>Sign NDA</label
					>
					<select
						id="sign-nda"
						v-model="ndaRegion"
						class="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5">
						<option value="" disabled>Select region</option>
						<option value="US">US</option>
						<option value="EMEA">EMEA</option>
					</select>
				</div>
			</div>
			<button class="primary-button-sm w-fit h-fit">Submit</button>
		</div>
	</div>
</template>
