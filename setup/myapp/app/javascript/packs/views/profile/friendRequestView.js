import _ from 'underscore'
import $ from 'jquery'
import Backbone from 'backbone'
import Helper from '../../Helper'

let friendRequests = Backbone.Model.extend({

    parse (response) {
        return { data: JSON.parse(response.success) }
    },

    initialize() {
        this.urlRoot = 'api/friend_requests/'
    }

});

let friendRequestsView = Backbone.View.extend({

    initialize(id) {
        console.log('friendRequestsView initialize')
        this.$el = $('#friend-requests-data')
        this.model = new friendRequests({ id: id })
        this.template = _.template($('script[name="friend_requests_template"]').html())
        this.update()
    },

    async update() {
        await Helper.fetch(this.model)
        this.render()
    },

    render() {
        this.$el.html(this.template({ 'friend_requests': this.model.toJSON() }))
        return this
    }

});

export default friendRequestsView
