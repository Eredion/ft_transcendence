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
    render_list() {
        console.log("RENDER LIST");
        async function fetchcol(){
            await Helper.fetch(channelcol).then(function() {
                console.log("AQUI");
                let template = _.template($("#online-channels-template").html())
                let output = template({'channels':channelcol.toJSON()});
                $('#channel-list').append(output);
            
        });
        fetchcol();
        return this;
        }
    },

    render() {
        console.log("RENDER");
        let template = _.template($("#channels-template").html())
        this.$el.html(template);
        this.render_list();
        return this;
    },


});

export default channelsView;