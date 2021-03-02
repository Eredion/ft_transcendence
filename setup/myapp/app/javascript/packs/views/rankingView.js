import _ from 'underscore'
import $ from 'jquery';
import Backbone from 'backbone'
import Helper from '../Helper';
import usercollection from '../models/user'
import guildCollection from '../models/guilds'
import tourncol from '../models/tournament'

let chatView = Backbone.View.extend({

    el: '#content',
    userCol: usercollection,
    tournCol: tourncol,

    initialize() {
        this.guildCol = new guildCollection();
    },

    sortByKey(array, key) {
        return array.sort(function(a, b) {
            var x = a[key]; var y = b[key];
            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        });
    },
    
    getTournament() {
        let tournament = this.tournCol.at(0);
        if (tournament === undefined)
        {
            tournament = {status: "no"};
            return tournament
        }
        return tournament.toJSON();
    },

    render() {
        self = this
        Promise.all([Helper.fetch(this.userCol), Helper.fetch(this.guildCol)], Helper.fetch(this.tournCol))
        .then(function(){
            let template0 = _.template($("#ranking-template").html());
            let tournament = self.getTournament();
            self.$el.html(template0({'tournament': tournament}));
            let template = _.template($("#user-ranking-template").html());
            let usersOrdered = self.sortByKey(self.userCol.toJSON(), "score");
            let output = template({'users':usersOrdered}); 
            $('#user-ranking').html(output);               
            let template2 = _.template($("#guild-ranking-template").html());
            let guildsOrdered = self.sortByKey(self.guildCol.toJSON(), "score");
            let output2 = template2({'guilds':guildsOrdered});
            $('#guild-ranking').html(output2);
            let template3 = _.template($("#tournament-list-template").html());
            let output3 = template3({'tournaments': self.tournCol.toJSON()});
            $('#tournament-ranking').html(output3);
        });
    },
});

export default chatView;
