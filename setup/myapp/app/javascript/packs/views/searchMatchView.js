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

        match_found_template: _.template($('#match_found_template').html()),
    
        initialize() {
            console.log('Search Match View initialize')
            // connecting to the channel by sending the user id
            this.render()
            Matchmaking.channel.connect(Helper.userId(), this.render_match_found, this)
        },
        
        render() {
            console.log('Search Match View render')
            this.$el.html(this.template());
            $('#search_match_modal').modal('show')
            return this;
        },

        // this function is called from matchmaking_channel when a match game is found
        render_match_found(player1, player2, match_id) {
            console.log('match_found render')
            $('#search_match_modal').modal('hide')
            this.$el.html(this.match_found_template({'player1': player1, 'player2': player2}));
            $('#match_found_modal').modal('show')
            //Redirection to the match
            setTimeout(function () {
                $('#match_found_modal').modal('hide')
                window.location.hash = 'match/'+match_id
            }, 3000)
        },

        removeChannel() {
            Matchmaking.channel.disconnect()
        }
    });
}
})

export default SearchMatch;
