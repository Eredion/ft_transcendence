import _ from 'underscore'
import $ from 'jquery';
import Backbone from 'backbone'
import Helper from '../Helper';

let tournamentView = Backbone.View.extend({
    el: '#content',
    async initialize(id){
        self = this;
        this.tournament = await Helper.ajax("GET", "api/tournaments/" + id)
        console.log(self.tournament);
        if (this.tournament === null)
            window.location.href = '#error';
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