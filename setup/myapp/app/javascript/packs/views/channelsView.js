import Backbone from 'backbone'
import $ from 'jquery'
import _ from 'underscore'
import Helper from '../Helper'
import channelcol from '../models/channel'
import consumer from "./../../channels/consumer"
import channelSubscription from './../../channels/channel_messages_channel'
let channelsView = Backbone.View.extend({

    el: '#content',
    collection: channelcol,
    cablenames: [],
    cables: [],
    events : {
        'click #reload-channels-button' : 'render_list',
        'click #exit-channel-button' : 'exit_channel',
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
        this.connectCable(name);
        /* $(`a[href="#channels/${name}"]`).removeClass('border border-success'); */
        await Helper.fetch(self.collection).then(function() {
            console.log(`rendering channel ${name}`);
            $('#channel-name-title').text(name);
            let template = _.template($("#channel_view_template").html())
            let channel = channelcol.where({name: name})[0];
            console.log(channel.get("name"));
            let output = template({'messages':channel.get("messages")});
            $('#channel_view').html(output);

            let input_template = _.template($('#channel-msg-input-template').html());
            let output2 = input_template({'channel': channel});
            $('#msg-input-form-wrapper').html(output2);
            // input-msg-channel-form
            $('#send-message-button').click(function(){
                setTimeout(function(){
                    $('#input-msg-channel-form').val("");
                    self.render_channel(name);
                }, 300);

            });
            
        });
        return this;
    },

    render_list() {
        this.fetchcol();
        
        return this;
    },

    render() {
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

    connectCable(name){
        self = this;
        $(`a[href="#channels/${name}"]`).removeClass('border border-success');
        
        if (self.cablenames.includes(name))
        {            
            console.log("YA EXISTE");
        }
        else
        {
            self.cablenames.push(name);
            self.cables.push(channelSubscription.joinChannel(name));
        }
        // { nombre: 'cerezas', cantidad: 5 }
    }, 

    exit_channel()
    {
        let tofind = $('#channel-name-title').text();
        console.log(`Exiting ${tofind}`)
        this.cables.find(cable => cable.channelname === tofind ).unsubscribe();
        this.render();
    },

});

export default channelsView;