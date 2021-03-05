import Backbone from 'backbone'
import $ from 'jquery'
import consumer from '../channels/consumer'
import usercollection from "./models/user"
import userscollection from './models/user'

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

Helper.TwoFaRequired = () => {
    return $('html').data().userRequiredtwofa
}

Helper.validateCode = () => {
    return $('html').data().userValidatecode
}

Helper.valid = () => {
    return (!Helper.TwoFaRequired() || (Helper.TwoFaRequired() && Helper.validateCode()))
}

Helper.userId = () => {
    return $('html').data().userId
};

Helper.getIdbyNickname = (nickname) => {
    return (usercollection.where({ nickname: nickname })[0].get('id'));
}

Helper.getNicknamebyId = (id) => {
    return (usercollection.where({ id: id })[0].get('nickname'));
}

Helper.amIAdmin = () => {
    return (userscollection.findWhere({id: Helper.userId()})).get("admin")
};

Helper.data = {
    newMsg: [],
    blockedUsers: [],
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

Helper.findCable = (channel, name="") => 
{
    for (let cable of consumer.subscriptions.subscriptions)
    {
        if (JSON.parse(cable.identifier).channel == channel && JSON.parse(cable.identifier).name == name)
        {
            return cable
        }
    }
    return null
}

Helper.notification = (message) => {
    var notification = document.createElement('div')
    var random_id = 'aid-' + Math.random().toString().substr(2) // generate random id and removes the first two chars (0.)
    notification.setAttribute('id', random_id)
    notification.setAttribute('role', 'alert')
    notification.classList.add('alert', 'notification', 'displaystyle-leftborder-info')
    notification.innerHTML =
        '<div class="row ml-2 justify-content-between align-items-center">\
            <p class="h6 text-info"> ' + message + ' </p>\
        </div>';
    document.getElementsByClassName('notification-container')[0].appendChild(notification)
    window.setTimeout(function() {
        $('#' + random_id).animate({ opacity: "toggle" }, function () {
            $(this).alert('close')
        });
    }, 2000);
};

export default Helper;
