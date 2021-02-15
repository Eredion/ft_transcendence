import _ from 'underscore';
import $ from 'jquery';
import Backbone from 'backbone';
import Helper from '../Helper';
import GuildCollection from '../models/guilds'

const Guilds = {}

if (Helper.logged()) {

$(function () {

    Guilds.collection = new GuildCollection();

    Guilds.GuildsView = Backbone.View.extend({

        el: "#content",

        collection: Guilds.collection,
    
        template: _.template($('#guilds-list-template').html()),

        events: {
            "submit #new-guild-form": "newGuild"
        },
        
        initialize() {
            console.log('Guilds View initialize')
        },

        async render() {
            console.log('render call')
            await Helper.fetch(this.collection)
            this.$el.html(this.template( { 'guilds': this.collection.toJSON() } ));
            return this
        },

        newGuild(e) {
            console.log('newGuild function called')
            e.preventDefault()
            e.stopPropagation()
            var formData = $('#new-guild-form').serialize()
            console.log(formData)
            document.getElementById("new-guild-form").reset()
        }
    });

    Guilds.Model = Backbone.Model.extend({

        parse (response) {
            return JSON.parse(response.success)
        },
    
        initialize(options) {
            this.gid = options.guild_id
            this.urlRoot = 'api/guilds/'+this.gid
        }
    });

    Guilds.GuildView = Backbone.View.extend({

        el: "#content",
    
        template: _.template($('#guild-show-template').html()),
        
        async initialize(id) {
            console.log('Guild '+ id +' View initialize')
            this.guild_id = id
            this.model = new Guilds.Model( { guild_id: this.guild_id } )
            await Helper.fetch(this.model)
            this.render()
        },

        render() {
            console.log('render call')
            this.$el.html(this.template( { 'guild': this.model.toJSON() } ));
            return this
        }
    });

    Guilds.view = new Guilds.GuildsView();

});

};

export default Guilds;
