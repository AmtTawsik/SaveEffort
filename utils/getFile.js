export default (file) => {
	return new Promise((resolve, reject) => {
		let reader = new FileReader();
		reader.onload = (e) => {
			resolve(e.target.result);
		};
		reader.onerror = (err) => {
			reject(false);
		};
		reader.readAsArrayBuffer(file);
	});
};
