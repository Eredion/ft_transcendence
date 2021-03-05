import $ from 'jquery'
import _ from 'underscore'
import Backbone from 'backbone'
import Helper from '../../Helper'
import MySession from '../../models/session'

const MatchHistory = {}

$(function () {

if (Helper.logged() && Helper.valid()) {

    MatchHistory.model = Backbone.Model.extend({

        parse (response) {
            return { data: JSON.parse(response.success) }
        },
    
        initialize(options) {
            this.uid = options.user_id
            this.urlRoot = 'api/users/' + this.uid + '/match_history'
        }
    
    });

    MatchHistory.view = Backbone.View.extend({

        el: "#user-matches-data",
    
        template: _.template($('#user_matches_template').html()),

        initialize(id) {
            this.user_id = id
            this.model = new MatchHistory.model({ user_id: this.user_id })
        },
    
        async update() {
            await Helper.fetch(this.model)
            this.render()
        },
    
        render() {
            this.$el.html(this.template({ 'matches': this.model.toJSON() }))
            return this
        }
    
    });
}
})

export default MatchHistory;
