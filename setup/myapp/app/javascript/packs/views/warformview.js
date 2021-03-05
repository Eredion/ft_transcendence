import _ from 'underscore'
import $ from 'jquery';
import consumer from '../../channels/consumer'
import Backbone from 'backbone'
import Helper from '../Helper';
import userscollection from '../models/user'
import GuildCollection from '../models/guilds'

let WarformView = Backbone.View.extend({
    el: "#content",
    owner: false,
    //template: _.template($('#new-war-template').html()),

    initialize(){
        this.collection = new GuildCollection();
        $(document).on("guild_redirect", function(){
            window.location.href = '#guilds';
        })
    },
    async render(){
        self = this;
        Promise.all([Helper.fetch(userscollection, Helper.fetch(this.collection))])
            .then(async function(){
                self.userGuild = await Helper.ajax('GET', 'api/users/' + Helper.userId() + '/guild')
                console.log(self.userGuild)
                if (self.userGuild.owner_id != Helper.userId())
                    return;
                let template = _.template($('#new-war-template').html());
                console.log(self.collection)
                self.$el.html(template({'guilds': self.collection.toJSON(), 'myid': Helper.userId()}))
            })
        
    },

});

export default WarformView;