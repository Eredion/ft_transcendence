import Backbone from 'backbone'
import $ from 'jquery'
import _ from 'underscore'
import Helper from '../Helper'
import channelcol from '../models/channel'

let channelsView = Backbone.View.extend({

    el: '#content',
    collection: channelcol,

    events : {
        'click #reload-channels-button' : 'render_list',
    },
    initialize() {
        
    },
    async fetchcol() {
        await Helper.fetch(channelcol).then(function() {
            console.log("FETCHCOL");
            let template = _.template($("#online-channels-template").html())
            let output = template({'channels':channelcol.toJSON()});
            $('#available-channels').html(output);
        });
    },

    async render_channel(name) {
        let self = this;
        
        await Helper.fetch(self.collection).then(function() {
            console.log(`rendering channel ${name}`);
            let template = _.template($("#channel_view_template").html())
            let channel = channelcol.where({name: name})[0];
            console.log(channel.get("name"));
            let output = template({'messages':channel.get("messages")});
            $('#channel_view').html(output);
        });
        return this;
    },

    render_list() {
        console.log("RENDER LIST");
        this.fetchcol();
        
        return this;
    },

    render() {
        console.log("RENDER");
        let self = this;
        let template = _.template($("#channels-template").html())
        this.$el.html(template);
        this.render_list();
        $('#create-channel-button').click(function(){
            setTimeout(function(){
                $('.create-channel-input').val("");
                self.render_list();
        }, 300);
        
        });
        return this;
    },


});

export default channelsView;