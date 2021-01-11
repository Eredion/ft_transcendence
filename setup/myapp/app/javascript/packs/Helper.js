
const Helper = {}

Helper.fetch = (model) => {
    return new Promise((resolve, reject) => {
        model.fetch({
            success(model) {
                resolve(model)
            },
            error(model, failure) {
                reject(failure)
            }
        })
    });
};

Helper.ajax = function(method, url, data) {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: url,
			type: method,
			data: data
		})
		.done(resolve)
		.fail(reject);
	})
};

Helper.logged = () => {
    return $('html').data().userLogged
};

export default Helper;