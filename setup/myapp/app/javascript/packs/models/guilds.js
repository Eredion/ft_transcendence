import Backbone from 'backbone'

let Guild = Backbone.Model.extend({

    urlRoot: 'api/guilds'
});

let GuildCollection = Backbone.Collection.extend({
    url: 'api/guilds',
    model: Guild
})

export default GuildCollection;
