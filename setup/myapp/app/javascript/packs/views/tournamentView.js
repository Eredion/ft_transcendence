import _ from 'underscore'
import $ from 'jquery';
import Backbone from 'backbone'
import Helper from '../Helper';
import usercollection from '../models/user'
import guildCollection from '../models/guilds'
import tourncol from '../models/tournament'

let tournamentView = Backbone.View.extend({
    el: '#content',
    initialize(id){
        this.tournament = Helper.ajax("GET", "api/tournaments/" + id)
        console.log("initialize tournament view")
    },

    render(id)
    {

    },
});

export default tournamentView;