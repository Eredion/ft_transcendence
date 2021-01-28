import Backbone from 'backbone'
import Helper from '../Helper.js'

// To do different types of notifications?
let NotificationBaseModel = Backbone.Model.extend();

let FriendRequest = NotificationBaseModel.extend({

    urlRoot: 'api/friend_requests/'
});

let NotificationCollection = Backbone.Collection.extend({

    url: 'api/friend_requests/' + Helper.userId(),

    model: FriendRequest,

    /*
    model(model, options) {
        if (model.type == 'FriendRequest') {
          return new FriendRequest(model, options);
        } else {
          return new NotificationBaseModel(model, options);
        }
    },

    modelId(attrs) {
        return attrs.type + '_' + attrs.id;
    },*/

    parse(response) {
        return JSON.parse(response.success)
    },

    initialize() {
        console.log('NotificationCollection initialize')
    }
});

let notificationcollection = new NotificationCollection();

export default notificationcollection;
