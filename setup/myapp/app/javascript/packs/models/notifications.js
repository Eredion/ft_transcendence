import Backbone from 'backbone'
import Helper from '../Helper.js'

// To do different types of notifications?
let NotificationBaseModel = Backbone.Model.extend();

let Request = NotificationBaseModel.extend({

    urlRoot: 'api/requests/'
});

let NotificationCollection = Backbone.Collection.extend({

    url: 'api/requests/' + Helper.userId(),

    model: Request,

    parse(response) {
        return JSON.parse(response.success)
    },

    initialize() {
        console.log('NotificationCollection initialize')
    }
});

let notificationcollection = new NotificationCollection();

export default notificationcollection;
