import $ from 'jquery'
import _ from 'underscore'
import Backbone from 'backbone'
import Helper from '../Helper'
import userscollection from '../models/user.js'
import Blockeds from './profile/blockedsView'
import Friends from './profile/friendsView'

const Profile = {}

$(function () {

    Profile.view = Backbone.View.extend({

        collection: userscollection,

        el: "#content",

        template: _.template($('#user_profile_template').html()),

        uinfo_template: _.template($('#user_info_template').html()),

        events: {
            "submit #avatar-form" : "updateAvatar",
            "submit #edit-user-form": "editUserForm",
            "click #addFriend": "addFriend",
            "click #blockUser": "blockUser"
        },
    
        async initialize(id) {
            this.user_id = id
            await Helper.fetch(this.collection)
            this.render()
            this.render_userInfo()
            this.friendView = new Friends.view(this.user_id)
            this.friendView.update()
            if (Helper.userId() == this.user_id) { // Only show block user list if is the current_user
                this.blockView = new Blockeds.view(this.user_id)
                this.blockView.update()
            }
        },
        
        render() {
            this.user = this.collection.get(this.user_id);
            this.$el.html(this.template({'user': this.user.toJSON()}));
            return this;
        },

        render_userInfo() {
            this.user = this.collection.get(this.user_id);
            this.$el.find('#user_info').html(this.uinfo_template({'user': this.user.toJSON()}));
        },

        render_friends() {
            if (this.friendView) {
                this.friendView.update()
            }
        },

        render_blockeds() {
            if (this.blockView) {
                this.blockView.update()
            }
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
                    self.render_userInfo();
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
                    self.render_userInfo()
                    Helper.custom_alert('success', 'Successfully updated.')
                }
            })
        },
    
        async addFriend(e) {
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

        undelegateChildViews() {
            if (this.blockView) {
                this.blockView.undelegateEvents()
            }
            if (this.friendView) {
                this.friendView.undelegateEvents()
            }
        }
    
    });
})

export default Profile;
