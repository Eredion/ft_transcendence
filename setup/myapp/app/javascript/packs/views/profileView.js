import _ from 'underscore'
import $ from 'jquery'
import Backbone from 'backbone'
import Helper from '../Helper'
import userscollection from '../models/user.js'
import blockedsView from './profile/blockedsView'
import friendsView from './profile/friendsView'
import friendRequestsView from './profile/friendRequestView'

let profileView = Backbone.View.extend({

    collection: userscollection,
    el: "div",
    id: "profile-user",
    
    events: {
        "submit #avatar-form" : "updateAvatar",
        "submit #edit-user-form": "editUserForm",
        "click #addFriend": "addFriend",
        "click #blockUser": "blockUser",
        "click .unblock-btn": "unblockUser"
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
        this.friendsview = new friendsView(this.user_id);
        if (Helper.userId() == this.user_id) {
            this.blockview = new blockedsView(this.user_id);
            this.friendReqview = new friendRequestsView(this.user_id);
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

    async addFriend(e) {
        console.log("Addfriend Event call!")
        e.preventDefault()
        var formData = {
            friend_request: {
                requestor_id: Helper.userId(),
                receiver_id: $(e.currentTarget).data().userfriendId
            }
        }
        var response = await Helper.ajax('POST', 'api/friend_requests', formData)
        if (response['error']) {
            Helper.custom_alert('danger', response['error'])
        } else {
            Helper.custom_alert('success', response['success'])
        }
    },

    async blockUser(e) {
        e.preventDefault()
        var formData = { user_id: $(e.currentTarget).data().userblockId }
        var response = await Helper.ajax('POST', 'users/' + Helper.userId() + '/block_user', formData)
        if (response['error']) {
            Helper.custom_alert('danger', response['error'])
        } else {
            Helper.custom_alert('success', response['success'])
        }
    },

    async unblockUser(e) {
        e.preventDefault()
        var formData = { user_id: $(e.currentTarget).data().userblockId }
        var response = await Helper.ajax('DELETE', 'users/' + Helper.userId() + '/unblock_user', formData)
        if (response['error']) {
            Helper.custom_alert('danger', response['error'])
        } else {
            this.blockview.update()
            Helper.custom_alert('success', response['success'])
        }
    },

    undelegateChildViews() {
        if (this.blockview) {
            this.blockview.undelegateEvents()
        }
        if (this.friendsview) {
            this.friendsview.undelegateEvents()
        }
        if (this.friendReqview) {
            this.friendReqview.undelegateEvents()
        }
    }

});

export default profileView;
