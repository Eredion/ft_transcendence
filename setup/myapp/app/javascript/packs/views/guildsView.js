import _ from 'underscore';
import $ from 'jquery';
import Backbone from 'backbone';
import Helper from '../Helper';
import GuildCollection from '../models/guilds'
import MyApp from '../application'
import Guild from '../../channels/guild_channel'
import AvailableGuilds from '../../channels/available_guilds_channel'

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

    Guilds.GuildView = Backbone.View.extend({

        el: "#content",
    
        template: _.template($('#guild-show-template').html()),

        events: {
            "click #join_guild": "joinGuild",
            "click #leave_guild": "leaveGuild",
            "click .become-officer-btn": "becomeOfficer",
            "click .remove-officer-btn": "removeOfficer",
            "click .kick-btn": "kickMember",
            "click #destroy-guild-btn": "destroyGuild",
            "submit #edit-guild-form": "editGuild"
        },
        
        async initialize(id) {
            console.log('Guild '+ id +' View initialize')
            this.guild_id = id
            this.model = new Guilds.Model( { guild_id: this.guild_id } )
            await Helper.fetch(this.model)
            this.render()
            Guild.channel.connect(this.guild_id, this.manage_guild, this)
        },

        manage_guild(data) {
            if (data['action'] == 'update') {
                this.update()
            } if (data['action'] == 'guild_removed') {
                MyApp.core.navigate('guilds')
            }
        },

        async update() {
            await Helper.fetch(this.model)
            this.render()
        },

        render() {
            console.log('render call')
            this.$el.html(this.template( { 'guild': this.model.toJSON() } ));
            return this
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
                this.update()
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
                    self.update()
                    Helper.custom_alert('success', response['success'])
                }
            })
        },

        removeChannel() {
            Guild.channel.disconnect()
        }
    });

});

};

export default Guilds;
