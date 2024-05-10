export default (oldArray, newArray) => {
	let added = [];
	let deleted = [];
	let updated = [];

	if (!oldArray && newArray?.length > 0) {
		added = newArray;

		return { added, deleted, updated };
	} else if (oldArray?.length > 0 && !newArray) {
		deleted = oldArray;

		return { added, deleted, updated };
	}

	// Find newly added items
	for (const newItem of newArray) {
		if (!oldArray?.includes(newItem)) {
			added.push(newItem);
		}
	}

	// Find deleted items
	for (const oldItem of oldArray) {
		if (!newArray?.includes(oldItem)) {
			deleted.push(oldItem);
		}
	}

	// Find updated items
	for (const newItem of newArray) {
		if (oldArray?.includes(newItem)) {
			const oldItemIndex = oldArray.indexOf(newItem);
			if (oldItemIndex !== -1 && oldArray[oldItemIndex] !== newItem) {
				updated.push({ oldItem: oldArray[oldItemIndex], newItem });
			}
		}
	}

	return { added, deleted, updated };
};
