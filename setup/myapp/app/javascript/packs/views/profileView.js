import _ from 'underscore'
import $ from 'jquery'
import Backbone from 'backbone'
import userscollection from '../models/user.js'
import Helper from '../Helper'

let BlockedUsers = Backbone.Model.extend({

    initialize(options) {
        this.uid = options.user_id
        this.urlRoot = 'users/' + this.uid + '/show_blocks'
    }

});


let blockedsView = Backbone.View.extend({
    el: $('#blocked_users'),

    async initialize(id) {
        console.log('blockedsView initialize')
        this.model = new BlockedUsers({user_id: id})
        this.template = _.template($('script[name="blocked_users_template"]').html())
        await Helper.fetch(this.model)
        this.render()
    },

    render() {
        let output = this.template({ 'blocked_users': this.model.toJSON() });
        this.$el.html(output);
        return this
    }
});

let profileView = Backbone.View.extend({

    collection: userscollection,
    el: "div",
    id: "profile-user",
    
    events: {
        "submit #avatar-form" : "updateAvatar",
        "submit #edit-user-form": "editUserForm",
        "click #addFriend": "addFriend",
        "click #blockUser": "blockUser"
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
        if ($('html').data().userId == this.user_id) {
            this.blckview = new blockedsView(this.user_id);
        }
        return this;
    },

    updateAvatar(e) {
        var input = document.getElementById('avatarFileInput')
        if (input.files && input.files[0]) { //Checks if a file is uploaded
            const self = this
            setTimeout(async function() {
                await Helper.fetch(self.collection)
                var nav_avatar = document.getElementById('nav-avatar-user')
                var c_user = self.collection.get(self.user_id).toJSON();
                nav_avatar.src = c_user.avatar.thumb.url
                self.render();
            }, 1000)
        } else {
            e.preventDefault()
            e.stopPropagation()
        }
    },

    editUserForm(e) {
        e.preventDefault()
        e.stopPropagation()
        this.user.set({
            nickname: $('#form-nickname').val(),
            name: $('#form-name').val()
        })
        const self = this
        this.user.save().then( function (response) {
            $('#editUserModal').modal('hide')
            if (response['error']) {

                document.getElementById('edit-user-form').reset()
                Helper.custom_alert('danger', response['error'])
            } else {

                var nav_avatar = document.getElementById('nav-nickname-user')
                nav_avatar.innerHTML = $('#form-nickname').val()
                self.render()
                Helper.custom_alert('success', 'Successfully updated.')
            }
        })
    },

    addFriend(e) {
        console.log("Addfriend Event call!")
    },

    blockUser(e) {
        console.log("blockUser Event call!")
    }

});

export default profileView;
