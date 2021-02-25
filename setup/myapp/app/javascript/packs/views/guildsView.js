import _ from 'underscore';
import $ from 'jquery';
import Backbone from 'backbone';
import Helper from '../Helper';
import GuildCollection from '../models/guilds'
import MyApp from '../application'
import Guild from '../../channels/guild_channel'
import AvailableGuilds from '../../channels/available_guilds_channel'
import userscol from '../models/user'
import warcol from '../models/war'
import MySession from '../models/session'

const Guilds = {}

if (Helper.logged()) {

$(function () {

    Guilds.collection = new GuildCollection();

    Guilds.GuildsView = Backbone.View.extend({

        el: "#content",

        collection: Guilds.collection,
    
        template: _.template($('#guilds-list-template').html()),

        events: {
            "submit #new-guild-form": "newGuild",
        },
        
        initialize() {
            console.log('Guilds View initialize')
        },
        
        async render() {
            console.log('render call')
            await Helper.fetch(this.collection)
            this.userGuild = await Helper.ajax('GET', 'api/users/' + Helper.userId() + '/guild')
            this.$el.html(this.template( { 'guilds': this.collection.toJSON(), 'user_guild': this.userGuild } ));
            AvailableGuilds.channel.connect(this.manage_data, this);
            return this
        },

        manage_data(data) {
            if (data['action'] == 'update') {
                this.render()
            }
        },

        async newGuild(e) {
            e.preventDefault()
            console.log('newGuild function called')
            if (!document.getElementById("form-guild-title").value.length || !document.getElementById("form-guild-anagram").value.length)
                return
            var formData = $('#new-guild-form').serialize()
            var response = await Helper.ajax('POST', 'api/guilds', formData)
            if (response['error']) {
                Helper.custom_alert('danger', response['error'])
            } else {
                document.getElementById("new-guild-form").reset()
                Helper.custom_alert('success', response['success'])
                MyApp.core.navigate('guilds/' + response['data']['id'])
                MySession.data.update()
            }
        },

        removeChannel() {
            AvailableGuilds.channel.disconnect()
        }
    });

    Guilds.view = new Guilds.GuildsView();

    Guilds.Model = Backbone.Model.extend({

        parse (response) {
            if (response.success) {
                return JSON.parse(response.success)
            }
        },
    
        initialize(options) {
            this.gid = options.guild_id
            this.urlRoot = 'api/guilds/'+this.gid
        }
    });

    Guilds.ChatModel = Backbone.Model.extend({
    
        initialize(options) {
            this.gid = options.chat_id
            this.urlRoot = 'api/chats/'+this.gid
        }
    });

    Guilds.GuildView = Backbone.View.extend({

        el: "#content",
    
        template: _.template($('#guild-show-template').html()),

        guild_info_tmpl: _.template($('#guild-info-template').html()),

        chat_tmpl: _.template($("#chat_guild_view_template").html()),

        guild_users_tmpl: _.template($("#users-guild-template").html()),

        events: {
            "click #join_guild": "joinGuild",
            "click #leave_guild": "leaveGuild",
            "click .become-officer-btn": "becomeOfficer",
            "click .remove-officer-btn": "removeOfficer",
            "click .kick-btn": "kickMember",
            "click #destroy-guild-btn": "destroyGuild",
            "click .war-declaration-request": "acceptWar",
            "submit #edit-guild-form": "editGuild",
            "submit #guild_avatar-form" : "updateGuildAvatar",
            "submit #chat_message_form": "newMessage",
        },
        
        async initialize(id) {
            this.guild_id = id
            this.model = new Guilds.Model( { guild_id: this.guild_id } )
            await Helper.fetch(this.model)
            await Helper.fetch(userscol)
            this.calculate_grade()
            this.render()
            this.render_info()
            this.render_users()
            this.render_war_declarations()
            Guild.channel.connect(this.guild_id, this.manage_guild, this)
            if (this.grade > 0) {
                this.chat_model = new Guilds.ChatModel( { chat_id: this.model.get('chat_id') } )
                await Helper.fetch(this.chat_model)
                this.render_chat()
                // conectarse al channel del chat
            }
        },

        calculate_grade() {
            this.grade = 0; // user dont belongs to the guild
            if ( ( _.findIndex( this.model.get('members'), { id: Helper.userId() } ) !== -1 ) ) {
                this.grade = 1
            } else if ( ( _.findIndex( this.model.get('officers'), { id: Helper.userId() } ) !== -1 ) ) {
                this.grade = 2
            } else if ( (this.model.get('owner').owner_id == Helper.userId()) ) {
                this.grade = 3
            }
        },
        
        manage_guild(data) {
            if (data['action'] == 'update_info') {
                this.update_info()
            } else if (data['action'] == 'update_users') {
                this.update_users()
                MySession.data.update()
            } else if (data['action'] == 'guild_removed') {
                MyApp.core.navigate('guilds')
                MySession.data.update()
            } else if (this.grade > 0 && data['action'] == 'new_message') {
                $('#chat_view').append(`<div class="chat_message bg-light p-2 rounded-pill mt-1">
                    <div class="message_author d-inline text-primary">
                    <a href="#popup1" onclick="render_popup(this)">${data['data'].author} :</a></div>
                    <div class="message_content d-inline text-dark">${data['data'].content}</div>
                    </div>`);
                    var chatDiv = document.getElementById('chat_view')
                    chatDiv.scrollTop = chatDiv.scrollHeight;
            }
        },

        async update_all() {
            await Helper.fetch(this.model)
            this.calculate_grade()
            this.render()
            this.render_info()
            this.render_users()
            this.render_war_declarations()
            this.chat_model = new Guilds.ChatModel( { chat_id: this.model.get('chat_id') } )
            await Helper.fetch(this.chat_model)
            this.render_chat()
            // conectarse al channel del chat
        },

        async update_info() {
            await Helper.fetch(this.model)
            this.render_info()
        },

        async update_users() {
            await Helper.fetch(this.model)
            this.render_users()
        },

        render() {
            console.log('render call')
            this.$el.html(this.template({
                'guild': this.model.toJSON(),
                'grade': this.grade
            }));
            return this
        },

        render_info() {
            this.$el.find('#guild-info-data').html(this.guild_info_tmpl({ 
                'guild': this.model.toJSON(),
                'grade': this.grade
            }));
        },

        render_chat() {
            this.$el.find('#guild-chat-template').html(this.chat_tmpl( { 'messages': this.chat_model.get('messages') } ));
            var chatDiv = document.getElementById('chat_view')
            chatDiv.scrollTop = chatDiv.scrollHeight;
        },

        render_users() {
            console.log('render_users call')
            this.$el.find('#users-guild-data').html(this.guild_users_tmpl({
                'guild': this.model.toJSON(),
                'admin': userscol.findWhere( { id: Helper.userId() } ).get('admin'),
                'grade': this.grade
            }));
            return this
        },

        async render_war_declarations() {
            console.log('render war declarations')
            self = this
            Promise.all([Helper.fetch(warcol)])
                .then(async function(){
                    self.userGuild = await Helper.ajax('GET', 'api/users/' + Helper.userId() + '/guild')
                    console.log(warcol.toJSON())
                    let war_declarations = []
                    for (let w of warcol)
                    {
                        console.log(self.userGuild)
                        console.log(self.userGuild.title)
                        if (w.get("to") === self.userGuild.title && w.get("status") === "request_sent")
                        {
                            war_declarations.push(w.toJSON())
                            console.log("ding")
                        }
                    }
                    let template = _.template($('#war-requests-template').html())
                    let filtered = warcol.where({'to': self.userGuild.title})
                    console.log(filtered)
                    let output = template({'wars': warcol.toJSON(), 'myguild': self.userGuild.title})
                    $('#war-declarations-wrapper').html(output)
                });
            
        },

        async acceptWar(e) {
            console.log(e)
            console.log($(e).data())
            console.log($(e.currentTarget).data().from)
            console.log($(e.currentTarget).data().to)
            console.log($(e.currentTarget).data().war)
            const formData = {
                request: {
                    id: $(e.currentTarget).data().war,
                    from: $(e.currentTarget).data().from,
                    to: $(e.currentTarget).data().to,
                    status: "accepted",
                }
            }
            let response = await Helper.ajax('PUT', 'api/wars/' + formData.request.id, formData)

        },

        newMessage(e) {
            e.preventDefault()
            Guild.channel.perform('add_message', {
                chat: this.model.get('chat_id'),
                guild: this.guild_id,
                from: Helper.userId(),
                message: document.getElementById("message_chat_guild").value
            })
            document.getElementById('chat_message_form').reset()
            document.getElementById("message_chat_guild").focus()
        },

        async joinGuild(e) {
            e.preventDefault()
            var data = {
                user_id: Helper.userId()
            }
            var response = await Helper.ajax('POST', 'api/guilds/' + this.guild_id + '/new_member', data)
            if (response['error']) {
                Helper.custom_alert('danger', response['error'])
            } else {
                Helper.custom_alert('success', response['success'])
                this.update_all()
            }
        },

        async leaveGuild(e) {
            e.preventDefault()
            var data = {
                user_id: Helper.userId()
            }
            var response = await Helper.ajax('DELETE', 'api/guilds/' + this.guild_id + '/leave_guild', data)
            if (response['error']) {
                Helper.custom_alert('danger', response['error'])
            } else {
                Helper.custom_alert('success', response['success'])
                MyApp.core.navigate('guilds')
                MySession.data.update()
            }
        },

        becomeOfficer(e) {
            e.preventDefault()
            Guild.channel.perform('made_officer', {
                guild: this.guild_id,
                from: Helper.userId(),
                member: $(e.currentTarget).data().memberId
            })
        },

        removeOfficer(e) {
            e.preventDefault()
            Guild.channel.perform('remove_officer', {
                guild: this.guild_id,
                from: Helper.userId(),
                member: $(e.currentTarget).data().officerId
            })
        },

        kickMember(e) {
            e.preventDefault()
            Guild.channel.perform('kick', {
                guild: this.guild_id,
                from: Helper.userId(),
                member: $(e.currentTarget).data().memberId
            })
        },

        async destroyGuild(e) {
            e.preventDefault()
            var data = {
                user_id: Helper.userId()
            }
            var response = await Helper.ajax('DELETE', 'api/guilds/' + this.guild_id, data)
            if (response['error']) {
                Helper.custom_alert('danger', response['error'])
            } else {
                Helper.custom_alert('success', response['success'])
                MyApp.core.navigate('guilds')
                MySession.data.update()
            }
        },

        editGuild(e) {
            e.preventDefault()
            var formData = {
                title: $('#form-title').val(),
                anagram: $('#form-anagram').val()
            }
            const self = this
            Helper.ajax('PUT', 'api/guilds/' + this.guild_id, formData).then( function (response) {
                $('#editGuildModal').modal('hide')
                if (response['error']) {
    
                    document.getElementById('edit-guild-form').reset()
                    Helper.custom_alert('danger', response['error'])
                } else {
                    //self.update_info()
                    Helper.custom_alert('success', response['success'])
                }
            })
        },

        updateGuildAvatar(e) {
            var input = document.getElementById('guildFileInput')
            if (input.files && input.files[0]) {
                const self = this
                setTimeout(function() {
                    self.update_info();
                }, 1000)
            } else {
                e.preventDefault()
                e.stopPropagation()
            }
        },

        removeChannel() {
            Guild.channel.disconnect()
        }
    });

});

};

export default Guilds;
