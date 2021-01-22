import _ from 'underscore'
import $ from 'jquery'
import Backbone from 'backbone'
import Helper from '../../Helper'

let userFriends = Backbone.Model.extend({

    parse (response) {
        return { data: JSON.parse(response.success) }
    },

    initialize(options) {
        this.uid = options.user_id
        this.urlRoot = 'api/users/' + this.uid + '/show_friends'
    }

});

let friendsView = Backbone.View.extend({
    
    initialize(id) {
        console.log('friendsView initialize')
        this.$el = $('#user-friends-data')
        this.model = new userFriends({user_id: id})
        this.template = _.template($('script[name="user_friends_template"]').html())
        this.update()
    },

    async update() {
        await Helper.fetch(this.model)
        this.render()
    },

    render() {
        this.$el.html(this.template({ 'user_friends': this.model.toJSON() }))
        return this
    }

});

export default friendsView
