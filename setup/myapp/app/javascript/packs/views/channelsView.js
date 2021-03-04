import Backbone from 'backbone'
import $ from 'jquery'
import _ from 'underscore'
import Helper from '../Helper'
import channelcol from '../models/channel'
import userscol from '../models/user'
import consumer from "./../../channels/consumer"
import channelSubscription from './../../channels/channel_messages_channel'
import availablechannelsChannel from "./../../channels/available_channels_channel"
import Workspace from '../routes'
import bcryptjs from 'bcryptjs'
let channelsView = Backbone.View.extend({

    el: '#content',
    collection: channelcol,
    cablenames: [],
    cables: [],
    events: {
        'click .render-channel-button':'check_password',
    },

    initialize() {
        let self = this;
        self.newchannelscable = availablechannelsChannel.connect();
        $(document).on("update_channels_event", function(event) {
            self.render_list();
            let chname = $('#channel-name-title').text();
            if (chname.length > 0 && chname != 'Conversation')
                self.render_sidepanel(chname);
        });
        $(document).on("kick", function(event, user, channel) {
            if ($('#channel-name-title').text() === channel && Helper.userId() === user) {
                self.exit_channel();
                self.render();
            }
        });
        $(document).on("render_full_view", function(event, channel) {
            if ($('#channel-name-title').text() === channel) {
                if ((userscol.findWhere({ id: Helper.userId() })).get("admin") === false) {
                    window.location.href = '#channels';
                    Helper.custom_alert('danger', `The channel "${channel}" was removed`);
                }
                self.render();
            } else
                self.render_list();
        });
    },

    async fetchcol() {
        await Helper.fetch(channelcol).then(function() {
            let template = _.template($("#online-channels-template").html())
            let output = template({ 'channels': channelcol.toJSON() });
            $('#available-channels').html(output);
        });
    },

    async updateBlockedUsers() {
        await Helper.fetch(userscol).then(function() {
            let myself = userscol.findWhere({ id: Helper.userId() })
            Helper.data.blockedUsers = myself.get("blocked");
        });
    },

    async render_channel(name) {
        let self = this;
        $('#input-msg-channel-form').focus();
        this.connectCable(name);
        /* $(`a[href="#channels/${name}"]`).removeClass('border border-success'); */
        await Helper.fetch(self.collection).then(function() {
            $('#channel-name-title').text(name);
            let template = _.template($("#channel_view_template").html())
            let channel = channelcol.where({ name: name })[0];
            let myself = userscol.findWhere({ id: Helper.userId() });
            let channeladmin = channel.get("admins").includes(Helper.userId())
            let output = template({
                'messages': channel.get("messages"),
                'blockedUsers': Helper.data.blockedUsers,
                'channel_id': parseInt(channel.get("id")),
                'channelname': channel.get("name"),
                'admin': myself.get('admin'),
                'channeladmin': channeladmin,
                'channeltype' : channel.get('category'),
            });
            $('#channel_view').html(output);
            let input_template = _.template($('#channel-msg-input-template').html());
            let output2 = input_template({ 'channel': channel, });
            $('#msg-input-form-wrapper').html(output2);
            //render side panel
            self.render_sidepanel(name);
            // input-msg-channel-form
            $('#send-message-button').click(function() {
                setTimeout(function() {
                    $('#input-msg-channel-form').val("");
                    self.render_channel(name);
                    $('#input-msg-channel-form').focus();
                }, 300);
            });
            $("#msg-input-form").submit(function(event) {
                event.preventDefault();
            });
            $('#exit-channel-button').click(function() {
                self.exit_channel();
            });
            $('#delete-channel-button').click(function() {
                if (myself.get('admin') === true)
                    self.newchannelscable.perform("destroy_channel", { channel: $('#channel-name-title').text() })
            });
            $('#remove-password-button').on('click', function(){
                let data = {'category' : 'public'}
                Helper.ajax("PUT", "api/channels/" + channel.get("id"), data);
                self.render_channel(name);
                
            })
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
        $('#create-channel-button').click(function() {
            setTimeout(function() {
                $('.create-channel-input').val("");
            }, 300);

        });

        return this;
    },

    connectCable(name) {
        self = this;
        $(`a[href="#channels/${name}"]`).removeClass('border border-success');
        if (Helper.findCable("ChannelMessagesChannel", name) != null)
            console.log("Already subscribed to this channel.");
        else {
            console.log("JUST JOINED " + name)
            self.cablenames.push(name);
            let c = channelSubscription.joinChannel(name)
            self.cables.push(c);
        }
        let c = Helper.findCable("ChannelMessagesChannel", name)
        c.perform("add_user_to_channel", { channel: name, user: Helper.current_user() });
    },

    async exit_channel() {
        self = this;
        let tofind = $('#channel-name-title').text();
        await Helper.fetch(channelcol).then(function() {
            let chan = channelcol.where({ name: tofind })[0];
            let members = chan.get("members");
        });

        self.cablenames = self.cablenames.filter(function(e) { return e !== tofind })
        let cable = self.cables.find(cable => cable.channelname === tofind)
        cable.perform("remove_user", { channel: tofind, user: Helper.current_user() });
        self.newchannelscable.perform("force_render_channel_list");
        consumer.subscriptions.remove(cable)
        Helper.findCable("ChannelMessagesChannel", "canal7")
        let index = self.cables.indexOf(cable);
        self.cables.splice(index, 1);
        $('#channel_view').html();
        window.location.href = '#channels';
        Backbone.history.loadUrl();
    },
    show_popup() {
        $('#channel-password-popup').css("visibility", "visible");
        $('#channel-password-popup').css("opacity", 1);
    },

    hide_popup() {
        $('#channel-password-popup').css("visibility", "hidden");
        $('#channel-password-popup').css("opacity", 0);
    },

    async check_password(e) {
        name = $(e.currentTarget).data().channel
        self = this;
        await Helper.fetch(self.collection).then(function() {
            let chan = self.collection.where({ name: name })[0];
            let members = []
            if (chan != undefined)
                members = chan.get("members");
            if (chan.get("banned").includes(Helper.userId()) && Helper.amIAdmin() === false) {
                alert("You are banned from this channel.")
                return;
            }
            let categ = chan.get("category");
            if (Helper.amIAdmin() === true || (categ === "public" && members.includes(Helper.userId()))) {
                self.render_channel(name);
            } else if (categ === "public") {
                self.render_channel(name);
            } else {
                $('.popup-content').html("<div></div>");
                self.show_popup();
                $('.close').click(function() {
                    self.hide_popup();
                });
                $('#channel-password-form').submit(function() {
                    let hash = chan.get("password_digest");
                    let pass = $('#channel-password-form').find('input[name="pass"]').val();
                    if (bcryptjs.compareSync(pass, hash)) {
                        self.hide_popup();
                        self.render_channel(name);
                    } else
                        self.hide_popup();
                })

            }
        });
    },

    render_sidepanel(name) {
        self = this;
        let template = _.template($("#channel-sidepanel-template").html())
        Promise.all([Helper.fetch(userscol), Helper.fetch(channelcol)])
            .then(function() {
                let channel = channelcol.where({ name: name })[0];
                let member_ids = channel.get("members");
                let members = userscol.filter(function(u) {
                    let id = u.get("id")
                    for (let m of member_ids) {
                        if (m === id)
                            return true;
                    }
                    return false;
                });
                let output = template({
                    'members': members,
                    'channel': channel,
                    'admin': (userscol.findWhere({ id: Helper.userId() })).get("admin")
                });
                $('#channel-sidepanel').html(output);
                $('.mute1min').click(function() {
                    self.mute1min($(this).data("id"), $(this).data("channel"))
                });
                $('.kick').click(function() {
                    self.kick($(this).data("id"), $(this).data("channel"))
                });
                $('.set-admin').click(function() {
                    self.setAdmin($(this).data("id"), $(this).data("channel"))
                });
                $('#refresh-sidepanel-button').click(function() {
                    self.render_sidepanel($('#channel-name-title').text());
                });
            });
    },

    mute1min(id, channel) {
        this.newchannelscable.perform(
            "silence", {
                id: id,
                channel: channel,
                tsec: 60
            }
        );
    },

    kick(id, channel) {
        let cable = this.cables.find(cable => cable.channelname === channel);
        this.newchannelscable.perform("kick", { channel: channel, user: id });
    },

    setAdmin(id, channel) {
        this.newchannelscable.perform(
            "setAdmin", {
                id: id,
                channel: channel,
            });
    },

    disconnect(){
        if (this.newchannelscable)
            consumer.subscriptions.remove(this.newchannelscable);
    },

});

export default channelsView;