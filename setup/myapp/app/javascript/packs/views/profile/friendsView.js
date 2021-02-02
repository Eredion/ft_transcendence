import _ from 'underscore'
import $ from 'jquery'
import Backbone from 'backbone'
import Helper from '../../Helper'

const Friends = {}

$(function () {

if (Helper.logged()) {

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
        }
    
    });
}
})

export default Friends;
