
const Helper = {};

Helper.fetch = function (collection) {
	return new Promise((resolve, reject) => {
		collection.fetch({
			success: function (collection) {
				resolve(collection);
			},
			error: function (collection, response) {
				reject(response);
			}
		});
	})
}

export default Helper