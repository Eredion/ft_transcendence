import _ from 'underscore';
import $ from 'jquery';
import Backbone from 'backbone';
import Helper from '../Helper';
import FriendCollection from '../models/friends'

const Friends = {}

if (Helper.logged()) {

$(function () {

    Friends.collection = new FriendCollection();

    Friends.FriendsView = Backbone.View.extend({

        el: "#friends_container",

        collection: Friends.collection,
    
        template: _.template($('#user_friends_button_template').html()),

        data_template: _.template($('#user_friends_data_template').html()),

        events: {
            "click .unfriend-btn": "unfriendUser"
        },
        
        initialize() {
            this.render()
        },

        render() {
            this.$el.html(this.template());
            return this
        },

        async update() {
            await Helper.fetch(this.collection)
            this.render_data()
        },

        render_data() {
            this.$el.find('#friends_data_container').html(this.data_template({ 'user_friends': this.collection.toJSON() }));
            return this
        },

        async unfriendUser(e) {
            e.preventDefault()
            e.stopPropagation()
            var formData = { user_id: $(e.currentTarget).data().userfriendId }
            var response = await Helper.ajax('DELETE', 'api/users/' + Helper.userId() + '/delete_friend', formData)
            if (response['error']) {
                Helper.custom_alert('danger', response['error'])
            } else {
                Helper.custom_alert('success', response['success'])
                this.update()
            }
        }
    });

    Friends.view = new Friends.FriendsView();

});

};

export default Friends;
