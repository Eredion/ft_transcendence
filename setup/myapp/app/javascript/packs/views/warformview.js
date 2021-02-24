import _ from 'underscore'
import $ from 'jquery';
import consumer from '../../channels/consumer'
import Backbone from 'backbone'
import Helper from '../Helper';
import userscollection from '../models/user'
import GuildCollection from '../models/guilds'

let WarformView = Backbone.View.extend({
    el: "#content",
    collection: GuildCollection,
    owner: false,
    //template: _.template($('#new-war-template').html()),

    async initialize(){
        
    },
    async render(){
        this.userGuild = await Helper.ajax('GET', 'api/users/' + Helper.userId() + '/guild')
        console.log(this.userGuild)
        if (this.userGuild.owner_id != Helper.userId())
            return;
        let template = _.template($('#new-war-template').html());
        this.$el.html(template())
    },

});

export default WarformView;