
const Helper = {};

Helper.fetch = function (collection) {
	return new Promise((resolve, reject) => {
		collection.fetch({
			success: function (collection) {
				console.log("final length " + collection.length);
				resolve(collection);
			},
			error: function (collection, response) {
				reject(response);
			}
		});
	})
}

export default Helper