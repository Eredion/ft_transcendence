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

        events: {
            "click #f-match": "finish_match"
        },

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
                    this.pong.listen(this.current_user, 'l');
                } else if (this.current_user === this.model.get('right_player_id')) {
                    console.log('right_player ' + this.current_user + ' listening keymoves')
                    this.pong.listen(this.current_user, 'r');
                }
            }
            Matches.channel.connect(this.match_id, this.update_match, this)
        },

        render() {
            console.log('Match View render')
            this.$el.html(this.template( { 'match' : this.model.toJSON() } ));
            return this;
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

        update_match(data) {
            if (data['actors']) {
                this.pong.update_match(data['actors'])
            } else {
                this.renderResult(data);
            }
        },

        finish_match(e) {
            console.log('Sending action to finish the match')
            e.preventDefault()
            var data = {
                match: this.match_id
            }
            Matches.channel.perform('finish_match', data)
        },

        removeChannel() {
            Matches.channel.disconnect()
            this.pong.stop()
        }
    });
}
})

export default Match;
