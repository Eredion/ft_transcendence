import Backbone from 'backbone'
import Helper from '../Helper.js'

let ChannelModel = Backbone.Model.extend({
    urlRoot: 'api/channels',
    initialize: function() {
        console.log("Fetching channel [" + this.get("name") + "]");
    },
});

let ChannelCollection = Backbone.Collection.extend({
    url: 'api/channels',
    model: ChannelModel,
    parse: function(data) {
        return data;

    },
    initialize: function() {
        Helper.fetch(this);
    },
});

let channelcol = new ChannelCollection();
export default channelcol;