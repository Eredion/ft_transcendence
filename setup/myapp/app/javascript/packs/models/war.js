import Backbone from 'backbone'
import Helper from '../Helper.js'

let WarModel = Backbone.Model.extend({
    urlRoot: 'api/wars',
    initialize: function() {
    },
});

let WarCol = Backbone.Collection.extend({
    url: 'api/wars',
    model: WarModel,
    parse: function(data) {
        return data;

    },
    initialize: function() {
        //Helper.fetch(this);
    },
});

let warcol = new WarCol();
export default warcol;