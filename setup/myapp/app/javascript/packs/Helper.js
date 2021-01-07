
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
}

Helper.fetch = (collection) => {
    return new Promise((resolve, reject) => {
        collection.fetch({
            success(collection) {
                resolve(collection)
            },
            error(collection, failure) {
                reject(failure)
            }
        })
    });
}

export default Helper;