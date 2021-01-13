import _ from 'underscore'
import Backbone from 'backbone'
import userscollection from '../models/user.js'
import Helper from '../Helper'


let profileView = Backbone.View.extend({

    collection: userscollection,
    el: "div",
    id: "profile-user",
    
    events: {
        "submit #avatar-form" : "updateAvatar",
    },    

    async initialize(id) {
        console.log("Profile View initialize");
        this.user_id = id
        this.template = _.template($('script[name="userProfile"]').html()); // views/pong/_profile.html.erb
        await Helper.fetch(this.collection)
        this.render();
    },
    
    render() {
        this.user = this.collection.get(this.user_id);
        $("#content").html(this.template({'user': this.user.toJSON()}));
        return this;
    },

    updateAvatar() {
        console.log('updateAvatar event')
        const self = this
        setTimeout(async function() {
            await Helper.fetch(self.collection)
            var nav_avatar = document.getElementById('nav-avatar-user')
            var c_user = self.collection.get(self.user_id).toJSON();
            nav_avatar.src = c_user.avatar.thumb.url
            self.render();
        }, 1000)
    }

});

export default profileView;
