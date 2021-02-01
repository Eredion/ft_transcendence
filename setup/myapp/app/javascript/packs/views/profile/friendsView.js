import _ from 'underscore'
import $ from 'jquery'
import Backbone from 'backbone'
import Helper from '../../Helper'

const Friends = {}

$(function () {

    Friends.UsersModel = Backbone.Model.extend({

        parse (response) {
            return { data: JSON.parse(response.success) }
        },
    
        initialize(options) {
            this.uid = options.user_id
            this.urlRoot = 'api/users/' + this.uid + '/show_friends'
        }
    
    });

    Friends.view = Backbone.View.extend({

        el: "#user-friends-data",
    
        template: _.template($('#user_friends_template').html()),

        events: {
            "click .unfriend-btn": "unfriendUser"
        },

        initialize(id) {
            this.user_id = id
            this.model = new Friends.UsersModel({ user_id: this.user_id })
        },
    
        async update() {
            await Helper.fetch(this.model)
            this.render()
        },
    
        render() {
            this.$el.html(this.template({ 'user_friends': this.model.toJSON(), 'current_user': this.user_id }))
            return this
        },

        async unfriendUser(e) {
            e.preventDefault()
            var formData = { user_id: $(e.currentTarget).data().userfriendId }
            var response = await Helper.ajax('DELETE', 'api/users/' + Helper.userId() + '/delete_friend', formData)
            if (response['error']) {
                Helper.custom_alert('danger', response['error'])
            } else {
                this.update()
                Helper.custom_alert('success', response['success'])
            }
        }
    
    });
})

export default Friends;
