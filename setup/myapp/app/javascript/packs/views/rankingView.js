import _ from 'underscore'
import $ from 'jquery';
import Backbone from 'backbone'
import Helper from '../Helper';
import usercollection from '../models/user'
import guildCollection from '../models/guilds'

let chatView = Backbone.View.extend({

    el: '#content',
    userCol: usercollection,

    initialize() {
        this.guildCol = new guildCollection();
    },

    sortByKey(array, key) {
        return array.sort(function(a, b) {
            var x = a[key]; var y = b[key];
            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        });
    },

    render() {
        self = this
        let template = _.template($("#ranking-template").html());
        this.$el.html(template);
        Promise.all([Helper.fetch(this.userCol), Helper.fetch(this.guildCol)])
            .then(function(){
            console.log("allé voy");
            let template = _.template($("#user-ranking-template").html());
            let usersOrdered = self.sortByKey(self.userCol.toJSON(), "score");
            let output = template({'users':usersOrdered}); 
            $('#user-ranking').html(output);               
            let template2 = _.template($("#guild-ranking-template").html());
            let guildsOrdered = self.sortByKey(self.guildCol.toJSON(), "score");
            let output2 = template2({'guilds':guildsOrdered});
            $('#guild-ranking').html(output2);
        });
    },
});

export default chatView;
