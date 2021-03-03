import _ from 'underscore'
import $ from 'jquery';
import Backbone from 'backbone'
import Helper from '../Helper';
import usercollection from '../models/user'
import guildCollection from '../models/guilds'
import tourncol from '../models/tournament'

let tournamentView = Backbone.View.extend({
    el: '#content',
    async initialize(id){
        self = this;
        this.tournament = await Helper.ajax("GET", "api/tournaments/" + id)
        console.log(self.tournament);
        //if (this.tournament.history && this.tournament.history.length > 0)
            this.history = JSON.parse(this.tournament.history);
        console.log("initialize tournament view")
        this.render();
    },

    render()
    {
        self = this;
        console.log("torneo:")
        console.log(this.tournament); 
        let template = _.template($("#individual-tournament-ranking-template").html());
        console.log("historial:")
        console.log(this.history);
        let output = template({'history': self.history, 'tournament': self.tournament});
        this.$el.html(output);
    },
});

export default tournamentView;