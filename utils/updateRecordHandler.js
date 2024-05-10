const updateRecordHandler = (data, recordData, headers, emit) => {
	const { currentUser } = useRealmApp();
	const globalStore = useGlobalStore();

	const assign_headers = [];

	const addAssignHeader = (__data, header) => {
		header.assigned_value = __data;
		assign_headers.push(header);
	};

	if (!data) {
		return;
	}

	let changedFields = [];
	let set_data = {};

	const updateField = (fieldPath, recordValue, header, isParent = false) => {
		const currentValue = isParent
			? data[fieldPath.parent][fieldPath.field]
			: data[fieldPath];

		const fieldKey = isParent
			? `${fieldPath.parent}.${fieldPath.field}`
			: fieldPath;

		const fieldData = isParent ? data[fieldPath.parent] : data;

		// Check for ObjectId
		if (
			recordValue &&
			currentValue &&
			currentValue._bsontype &&
			currentValue._bsontype === "ObjectID"
		) {
			if (currentValue.toString() === recordValue.toString()) return;
		}

		// Check for arrays
		if (Array.isArray(recordValue) && Array.isArray(currentValue)) {
			const { added, updated, deleted } = compareArrays(
				currentValue,
				recordValue
			);

			if (added.length <= 0 && updated.length <= 0 && deleted.length <= 0)
				return;
		}

		if (currentValue !== recordValue && recordValue) {
			const field = isParent ? fieldPath.field : fieldPath;
			const beforeValue = fieldData?.[field] || null;

			const fieldType = beforeValue === null ? "added" : "edited";

			changedFields.push({
				type: fieldType,
				field: fieldKey,
				before: beforeValue,
				after: recordValue,
			});

			fieldData[field] = recordValue;
			set_data[fieldKey] = recordValue;

			if (header.is_assign_dropdown && header.assign_to_field) {
				addAssignHeader(recordValue, header);
			}
		}
	};

	for (const header of headers) {
		const { parent, field, is_update, type, combine } = header;

		if (is_update) {
			if (!parent) {
				if (type === "date") {
					const date1 = new Date(recordData[field]);
					const date2 = new Date(data[field]);

					if (date1.getTime() !== date2.getTime()) {
						updateField(field, date1, header);
					}
				} else {
					updateField(field, recordData[field], header);
				}
			} else {
				if (!data[parent]) {
					data[parent] = {};
				}

				if (type === "date") {
					const date1 = new Date(recordData[parent][field]);
					const date2 = new Date(data[parent][field]);

					if (date1.getTime() !== date2.getTime()) {
						updateField({ parent, field }, date1, header, true);
					}
				} else {
					updateField(
						{ parent, field },
						recordData[parent][field],
						header,
						true
					);
				}
			}
		}

		if (combine) {
			recordData[field] = combine
				.reduce((result, item) => result.concat(" ", recordData[item]), "")
				.trim();

			if (recordData[field] !== data[field]) {
				updateField(field, recordData[field], header);
			}
		}
	}

	if (!data.update_logs || data.update_logs.length === 0) {
		data.update_logs = [];
	}

	if (changedFields.length > 0) {
		data.update_logs.push({
			fields: changedFields,
			updated_at: new Date(),
			updated_by: currentUser?.id,
		});

		set_data.update_logs = data.update_logs;

		emit("updateRecord", {
			set: set_data,
			data,
			assign_headers,
			globalStore,
		});
	}
};

export default updateRecordHandler;
