import Backbone from 'backbone'
import Helper from '../Helper.js'

let TournamentModel = Backbone.Model.extend({
    urlRoot: 'api/tournaments',
    initialize: function() {
        console.log("Fetching tournament [" + this.get("name") + "]");
    },
});

let TournamentCol = Backbone.Collection.extend({
    url: 'api/tournaments',
    model: TournamentModel,

    initialize: function() {
        Helper.fetch(this);
        console.log("Fetching all tournaments");
    },
});

let trnmntcol = new TournamentCol();
export default trnmntcol;