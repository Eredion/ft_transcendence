import $ from 'jquery'
import _ from 'underscore'
import Backbone from 'backbone'
import Helper from '../Helper'
import Pong from '../pong-game'
import Matches from '../../channels/match_channel'

const Match = {}

$(function () {

if (Helper.logged()) {

    Match.Model = Backbone.Model.extend({

        parse (response) {
            return JSON.parse(response.success)
        },
    
        initialize(options) {
            this.mid = options.match_id
            this.urlRoot = 'api/matches/'+this.mid
        }
    
    });

    Match.view = Backbone.View.extend({

        el: "#content",

        template: _.template($('#match_template').html()),
    
        async initialize(id) {
            console.log('Match View initialize')
            this.match_id = id
            this.current_user = Helper.userId()
            this.model = new Match.Model( { match_id: this.match_id } )
            await Helper.fetch(this.model)
            this.render()
            this.pong = new Pong(this.match_id)
            if (!this.model.get('finished')) {

                if (this.current_user === this.model.get('left_player_id')) {
                    console.log('left_player ' + this.current_user + ' listening keymoves')
                    this.pong.listen(this.current_user, 'left');
                } else if (this.current_user === this.model.get('right_player_id')) {
                    console.log('right_player ' + this.current_user + ' listening keymoves')
                    this.pong.listen(this.current_user, 'right');
                }
            }
            Matches.channel.connect(this.match_id, this.update_match, this)
        },
        
        render() {
            console.log('Match View render')
            this.$el.html(this.template( { 'match' : this.model.toJSON() } ));
            return this;
        },

        update_match(data) {
            if (data['players']) {
                this.pong.update_players(data['players'])
            } else {
                console.log(data)
            }
        }
    });
}
})

export default Match;
