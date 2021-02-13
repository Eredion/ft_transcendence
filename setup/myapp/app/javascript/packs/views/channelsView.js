import Backbone from 'backbone'
import $ from 'jquery'
import _ from 'underscore'
import Helper from '../Helper'
import channelcol from '../models/channel'
import userscol from '../models/user'
import consumer from "./../../channels/consumer"
import channelSubscription from './../../channels/channel_messages_channel'
import newchannelscable from "./../../channels/available_channels_channel"
import Workspace from '../routes'
import bcryptjs from 'bcryptjs'
let channelsView = Backbone.View.extend({

    el: '#content',
    collection: channelcol,
    cablenames: [],
    cables: [],
    events : {
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

    async updateBlockedUsers(){
        await Helper.fetch(userscol).then(function(){
            let myself = userscol.findWhere({id: Helper.userId()})
            console.log(myself.get("nickname") + "ENCONTRADDO");
            let blocked = myself.get("blocked");
            console.log("BLOCKED : " + blocked)
            $('#blocked-users-data').data({"blocked": myself.get("blocked")});
            console.log("guardao" + $('#blocked-users-data').data())
        });
    },

    async render_channel(name) {
        let self = this;
        $('#input-msg-channel-form').focus();
        
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

            //render side panel
            self.render_sidepanel(name);
            //
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
        this.updateBlockedUsers();
        let template = _.template($("#channels-template").html())
        this.$el.html(template);
        this.render_list();
        $('#create-channel-button').click(function(){
            setTimeout(function(){
                $('.create-channel-input').val("");
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
                self.render_channel(name);
            }
            else if (categ === "public")
            {
                console.log("entering public chat");
                self.render_channel(name);
            }
            else
            {
                console.log("asking for password")
                $('.popup-content').html("<div></div>");
                self.show_popup();
                $('.close').click(function(){
                    channelsView.hide_popup();
                });
                $('#channel-password-form').submit(function(){
                    let hash = chan.get("password_digest");
                    let pass = $('#channel-password-form').find('input[name="pass"]').val();
                    if (bcryptjs.compareSync(pass, hash))
                    {
                        channelsView.hide_popup();
                        self.render_channel(name);
                    }
                    else
                        channelsView.hide_popup();
                })
                
            }
        });
    },

    async render_sidepanel(name){
        let template = _.template($("#channel-sidepanel-template").html())
        let channel = channelcol.where({name: name})[0];
        let member_ids = channel.get("members");
        await Helper.fetch(userscol)
            .then(function(){
            let members = userscol.filter(function(u){
                let id = u.get("id")
                for (let m of member_ids)
                {
                    if (m === id)
                        return true;
                }
                return false;
            });
            let output = template({'members': members});
            $('#channel-sidepanel').html(output);
        });
    },

    
});

export default channelsView;