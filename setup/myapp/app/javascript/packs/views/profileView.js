import _ from 'underscore'
import Backbone from 'backbone'
import userscollection from '../models/user.js'
import Helper from '../Helper'


let profileView = Backbone.View.extend({

    collection: userscollection,
    el: "div",
    id: "profile-user",

    async initialize(id) {
        console.log("Profile View initialize");
        this.template = _.template($('script[name="userProfile"]').html()); // views/pong/_profile.html.erb
        await Helper.fetch(this.collection)
        this.render(id);
    },
    
    render(user_id) {
        let user = this.collection.get(user_id);
        $("#content").html(this.template({'user': user.toJSON()}));
        return this;
    }

});

export default profileView;
