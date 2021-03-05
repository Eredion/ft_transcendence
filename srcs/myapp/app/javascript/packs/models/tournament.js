import Backbone from 'backbone'
import Helper from '../Helper.js'

let TournamentModel = Backbone.Model.extend({
    urlRoot: 'api/tournaments',
    initialize: function() {
    },
});

let TournamentCol = Backbone.Collection.extend({
    url: 'api/tournaments',
    model: TournamentModel,

    initialize: function() {
        //Helper.fetch(this);
    },
});

let trnmntcol = new TournamentCol();
export default trnmntcol;