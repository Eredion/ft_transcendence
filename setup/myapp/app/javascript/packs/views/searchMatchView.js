import $ from 'jquery'
import _ from 'underscore'
import Backbone from 'backbone'
import Helper from '../Helper'
import Matchmaking from '../../channels/matchmaking_channel'
import MyApp from '../application'

const SearchMatch = {}

$(function () {

if (Helper.logged()) {

    SearchMatch.view = Backbone.View.extend({

        el: "#content",

        template: _.template($('#search_match_template').html()),

        match_found_template: _.template($('#match_found_template').html()),

        initialize(id, from) {
            console.log('Search Match View initialize')
            // connecting to the channel by sending the user id
            if (id === 'quick' || id === 'ranked' || id === 'tournament')
            {
                this.type = id;
                this.render();
                Matchmaking.channel.connect(Helper.userId(), this.receive_data, this, id + "_game")
                return;
            }
            this.type = 'challenge';
            this.render()
            if (id && id.length > 0 && from &&  from.length > 0)
            {
                console.log("accepting challenge")
                Matchmaking.channel.connect(Helper.userId(), this.receive_data, this, "accept_peer", id)
            }
            else if (id && id.length > 0)
            {
                console.log("challenging someone")
                Matchmaking.channel.connect(Helper.userId(), this.receive_data, this, "wait_peer", id)
            }
            else
                Matchmaking.channel.connect(Helper.userId(), this.receive_data, this)
        },

        render() {
            console.log('Search Match View render type ' + this.type)
			let output = this.template({'type': this.type})
            this.$el.html(output);
            $('#search_match_modal').modal('show')
            return this;
        },

        // this function is called from matchmaking_channel when a match game is found
        receive_data(data) {
            switch (data.action) {
                case 'searching':
                    console.log('Waiting for opponent')
                    break;
                case 'game_found':
                    console.log('Game found')
					console.log(data)
                    this.render_match_found(data.player1, data.player2, data.match)
                    break;
                case 'current_game':
                    console.log('Redirection to current game')
                    $('#search_match_modal').modal('hide')
                    setTimeout(function () {
                        MyApp.core.navigate('match/' + data.match)
                    }, 300)
                    break;
            }
        },

		capitalize(word) {
			return word[0].toUpperCase() + word.slice(1).toLowerCase();
	  	},


        render_match_found(player1, player2, match_id) {
            console.log('match_found render')
            $('#search_match_modal').modal('hide')
            this.$el.html(this.match_found_template({
				'player1': player1,
				'player2': player2,
				'type': this.capitalize(this.type)
				}));
            $('#match_found_modal').modal('show')
            setTimeout(function () {
                $('#match_found_modal').modal('hide')
                //Redirection to the match
                setTimeout(function () {
                    MyApp.core.navigate('match/' + match_id)
                }, 300)
            }, 3000)
        },

        removeChannel() {
            Matchmaking.channel.disconnect()
        }
    });
}
})

export default SearchMatch;
