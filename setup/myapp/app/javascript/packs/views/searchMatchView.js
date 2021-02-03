import $ from 'jquery'
import _ from 'underscore'
import Backbone from 'backbone'
import Helper from '../Helper'
import Matchmaking from '../../channels/matchmaking_channel'

const SearchMatch = {}

$(function () {

if (Helper.logged()) {

    SearchMatch.view = Backbone.View.extend({

        el: "#content",

        template: _.template($('#search_match_template').html()),
    
        initialize() {
            console.log('Search Match View initialize')
            // connecting to the channel by sending the user id
            Matchmaking.channel.connect(Helper.userId())
            this.render()
        },
        
        render() {
            console.log('Search Match View render')
            this.$el.html(this.template());
            return this;
        },

        removeChannel() {
            Matchmaking.channel.disconnect()
        }
    });
}
})

export default SearchMatch;
