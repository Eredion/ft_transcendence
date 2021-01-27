import _ from 'underscore';
import $ from 'jquery';
import Backbone from 'backbone';

const Notification = {}

Notification.notificationView = Backbone.View.extend({

    template: _.template($('script[name="notification_template"]').html()),
    
    initialize() {
        console.log('notificationView initialize')
    },

    render() {
        console.log('notificationView render')
        $("#notifications-menu").html(this.template());
    }

});

Notification.view = new Notification.notificationView();

export default Notification;
