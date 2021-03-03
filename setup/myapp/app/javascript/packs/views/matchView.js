import $ from 'jquery'
import _ from 'underscore'
import Backbone from 'backbone'
import Helper from '../Helper'
import Pong from '../pong-game'
import Matches from '../../channels/match_channel'
import userCol from '../models/user'

const Match = {}

$(function () {

if (Helper.logged() && Helper.valid()) {

    Match.Model = Backbone.Model.extend({

        parse (response) {
            return response.success
        },

        initialize(options) {
            this.mid = options.match_id
            this.urlRoot = 'api/matches/'+this.mid
        }

    });

    Match.view = Backbone.View.extend({

        el: "#content",

        template: _.template($('#match_template').html()),

        l_player_tmpl: _.template($('#left_player_template').html()),
        
        r_player_tmpl: _.template($('#right_player_template').html()),

        events: {
            "click .check-ready": "send_ready"
        },

        async initialize(id) {
            console.log('Match View initialize')
            this.match_id = id
            this.current_user = Helper.userId()
            this.model = new Match.Model( { match_id: this.match_id } )
            await Helper.fetch(this.model)
            let jmodel = this.model.toJSON()
            this.render(jmodel)
            this.render_players(jmodel)
            Matches.channel.connect(this.match_id, this.update_match, this)
            this.pong = new Pong(this.match_id)
            this.active_moves()
        },

        active_moves() {
            if (!this.model.get('finished') && this.model.get('status') == "running") {

                if (this.current_user === this.model.get('left_player').id) {
                    console.log('left_player ' + this.current_user + ' listening keymoves')
                    this.pong.listen(this.current_user, 'l');
                } else if (this.current_user === this.model.get('right_player').id) {
                    console.log('right_player ' + this.current_user + ' listening keymoves')
                    this.pong.listen(this.current_user, 'r');
                }
            }
        },

        render(match_data) {
            console.log('Match View render')
            this.$el.html(this.template( { 'match' : match_data, 'user': this.current_user } ));
            return this;
        },

        render_players(players_data) {
            this.$el.find('#left_player_side').html(this.l_player_tmpl( { 'player' : players_data['left_player'], 'user': this.current_user } ));
            this.$el.find('#right_player_side').html(this.r_player_tmpl( { 'player' : players_data['right_player'], 'user': this.current_user } ));
        },

        async renderResult(data) {
            self = this;
            let template = _.template($('#finish_match_template').html());
            await Helper.fetch(userCol).then(function(){
                let myself = userCol.findWhere({id : self.current_user});
                console.log(myself.toJSON());
                self.$el.html(template({
				'match': data.match,
				'user': myself.toJSON(),
				'id': Helper.userId()
			}));
            });
        },

        async update_match(data) {
            if (data['action'] == "update_players") {
                this.render_players(data['data'])
            } else if (data['action'] == "start") {
                await Helper.fetch(this.model)
                this.active_moves()
            } else if (data['actors']) {
                this.pong.update_match(data['actors'])
            } else if (data['action'] == "finish_game") {
                this.renderResult(data);
            }
        },

        send_ready(e) {
            e.preventDefault()
            console.log('send ready func')
            Matches.channel.perform('set_ready', {
                match: this.match_id,
                from: Helper.userId(),
                player: $(e.currentTarget).data().playerId
            })
        },

        /*
        finish_match(e) {
            console.log('Sending action to finish the match')
            e.preventDefault()
            var data = {
                match: this.match_id
            }
            Matches.channel.perform('finish_match', data)
        },*/

        removeChannel() {
            Matches.channel.disconnect()
            this.pong.stop()
        }
    });
}
})

export default Match;
