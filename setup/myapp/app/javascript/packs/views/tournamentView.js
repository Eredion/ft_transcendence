import _ from 'underscore'
import $ from 'jquery';
import Backbone from 'backbone'
import Helper from '../Helper';

let tournamentView = Backbone.View.extend({
    el: '#content',
    async initialize(id){
        self = this;
        this.tournament = await Helper.ajax("GET", "api/tournaments/" + id)
        if (this.tournament === null)
            window.location.href = '#error';
        this.history = JSON.parse(this.tournament.history);
        this.render();
    },

    render()
    {
        self = this;
        let template = _.template($("#individual-tournament-ranking-template").html());
        let output = template({'history': self.history, 'tournament': self.tournament});
        this.$el.html(output);
    },
});

export default tournamentView;