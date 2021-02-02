import Backbone from 'backbone'
import Helper from '../Helper.js'

let FriendModel = Backbone.Model.extend({

    urlRoot: 'api/users/' + Helper.userId() + '/show_friends'

});

let FriendCollection = Backbone.Collection.extend({

    url: 'api/users/' + Helper.userId() + '/show_friends',
    
    model: FriendModel,

    parse (response) {
        return JSON.parse(response.success)
    }
});

export default FriendCollection;
