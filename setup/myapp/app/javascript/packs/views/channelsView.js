import Backbone from 'backbone'
import $ from 'jquery'
import _ from 'underscore'
import Helper from '../Helper'
import channelcol from '../models/channel'
import consumer from "./../../channels/consumer"
import channelSubscription from './../../channels/channel_messages_channel'
import newchannelscable from "./../../channels/available_channels_channel"
import Workspace from '../routes'

let channelsView = Backbone.View.extend({

    el: '#content',
    collection: channelcol,
    cablenames: [],
    cables: [],
    events : {
        "click #exit-channel-button" : "",
    },

    initialize() {
        console.log("INITIALIZING CHANNELVIEW");
        
    },
    async fetchcol() {
        await Helper.fetch(channelcol).then(function() {
            let template = _.template($("#online-channels-template").html())
            let output = template({'channels':channelcol.toJSON()});
            $('#available-channels').html(output);
        });
    },

    async render_channel(name) {
        let self = this;
        $('#input-msg-channel-form').focus();
        if (this.check_password(name) === false)
        {
            //Workspace.navigate('#channels/default', { trigger: true });
            return;
        }
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
                    $('#input-msg-channel-form').focus();
                }, 300);

            });
            $("#msg-input-form").submit(function(event) {
                event.preventDefault();
              }); 
            $('#exit-channel-button').click(function(){
                self.exit_channel();
             }
            ); 
            
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
                //self.render_list();
        }, 300);

        });
        return this;
    },

    connectCable(name){
        self = this;
        $(`a[href="#channels/${name}"]`).removeClass('border border-success');
        if (self.cablenames.includes(name))
            console.log("Already subscribed to this channel.");
        else
        {
            self.cablenames.push(name);
            let c = channelSubscription.joinChannel(name)
            self.cables.push(c);
        }
        let c = self.cables.find( cable => cable.channelname === name );
        c.perform("add_user_to_channel", {channel: name, user: Helper.current_user()});

    },

    async exit_channel()
    {
        self = this;
        let tofind = $('#channel-name-title').text();
        await Helper.fetch(channelcol).then(function(){
            let chan = channelcol.where({name: tofind})[0];
            let members = chan.get("members");
            console.log("members in this channel: "+members);
        });
        
        self.cablenames = self.cablenames.filter(function(e) { return e !== tofind })
        console.log(`Exiting ${tofind}`)
        let cable = self.cables.find(cable => cable.channelname === tofind )
        cable.perform("remove_user", {channel: tofind, user: Helper.current_user()});
        consumer.subscriptions.remove(cable)
        let index = self.cables.indexOf(cable);
        self.cables.splice(index, 1);
        this.render();
    },
    show_popup(){
        $('#channel-password-popup').css("visibility", "visible");
        $('#channel-password-popup').css("opacity", 1);
    },

    hide_popup(){
        $('#channel-password-popup').css("visibility", "hidden");
        $('#channel-password-popup').css("opacity", 0);
    },

    async check_password(name)
    {
        self = this;
        await Helper.fetch(self.collection).then(function(){
            let chan = self.collection.where({name: name})[0];
            let members = chan.get("members");
            console.log("members in this channel: "+members);
            
            let categ = chan.get("category");
            if (categ === "public" && members.includes(Helper.userId()))
            {
                console.log("user already in");
                return true;
            }
            else if (categ === "public")
            {
                console.log("entering public chat");
                return true;
            }
            else
            {
                console.log("asking for password")
                self.show_popup();
                $('.close').click(function(){
                    self.hide_popup();
                    return(false);
                });
                
            }
                //newchannelscable.perform()
        });
        //console.log(newchannelscable);
        return (true);
    },

    
});

export default channelsView;