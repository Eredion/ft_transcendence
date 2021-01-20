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
                data: data,
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            })
            .done(resolve)
            .fail(reject);
    })
};

Helper.logged = () => {
    return $('html').data().userLogged
};

Helper.userId = () => {
    return $('html').data().userId
};

Helper.custom_alert = (type, message) => {

    var alert = document.createElement('div')
    var random_id = 'aid-' + Math.random().toString().substr(2) // generate random id and removes the first two chars (0.)
    alert.setAttribute('id', random_id)
    alert.setAttribute('role', 'alert')
    alert.classList.add('alert', 'alert-' + type, 'alert-dismissible', 'fixed-top')
    alert.innerHTML =
        '<strong>' + message + '</strong>' +
        '<button class="close" type="button" data-dismiss="alert" aria-label="Close">' +
        '<span aria-hidden="true">&times</span>' +
        '</button>';
    document.body.appendChild(alert)
    window.setTimeout(function() {
        $('#' + random_id).slideUp("slow", function() {
            $(this).alert('close')
        });
    }, 2000);
};

Helper.current_user = () => {
    return $('#nav-nickname-user').text();
};

export default Helper;