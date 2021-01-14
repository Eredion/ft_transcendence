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
        "submit #edit-user-form": "editUserForm"
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
        this.user.save().then( function () {
            $('#editUserModal').modal('hide')
            var nav_avatar = document.getElementById('nav-nickname-user')
            nav_avatar.innerHTML = $('#form-nickname').val()
            self.render()
        })
    }

});

export default profileView;
