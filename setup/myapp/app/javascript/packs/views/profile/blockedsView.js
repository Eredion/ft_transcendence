import _ from 'underscore'
import $ from 'jquery'
import Backbone from 'backbone'
import Helper from '../../Helper'

let BlockedUsers = Backbone.Model.extend({

    parse (response) {
        return { data: JSON.parse(response.success) }
    },

    initialize(options) {
        this.uid = options.user_id
        this.urlRoot = 'api/users/' + this.uid + '/show_blockeds'
    }

});

let blockedsView = Backbone.View.extend({
    
    initialize(id) {
        console.log('blockedsView initialize')
        this.$el = $('#blocked-users-data')
        this.model = new BlockedUsers({user_id: id})
        this.template = _.template($('script[name="blocked_users_template"]').html())
        this.update()
    },

    async update() {
        await Helper.fetch(this.model)
        this.render()
    },

    render() {
        this.$el.html(this.template({ 'blocked_users': this.model.toJSON() }))
        return this
    }

});

export default blockedsView
