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

Helper.custom_alert = (type, message) => {
    var c_alert = document.createElement('div')
    c_alert.innerHTML =
        '<div id="custom-alert" class="alert alert-' + type + ' alert-dismissible fixed-top" role="alert">' +
        '<strong>' + message + '</strong>' +
        '<button class="close" type="button" data-dismiss="alert" aria-label="Close">' +
        '<span aria-hidden="true">x</span>' +
        '</button>' +
        '</div>';
    setTimeout(function() {
        $('#custom-alert').parent().slideUp("slow", function() {
            document.body.removeChild(this);
        });
    }, 3000);
    document.body.appendChild(c_alert)
};

Helper.current_user = () => {
    return $('#nav-nickname-user').text;
};

export default Helper;