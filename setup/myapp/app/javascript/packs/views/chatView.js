import _ from 'underscore'
import $ from 'jquery';
import Backbone from 'backbone'
import chatcol from '../models/chat'
import conversView from './conversationView'
import channelsView from './channelsView'
import Helper from '../Helper';
import dm_channel_helper from '../../channels/dm_channel'
import usercollection from '../models/user'
let chatView = Backbone.View.extend({

    el: '#content',
    chatsCol: chatcol,
    userCol: usercollection,
    events : {
        'click #online-user-button' : 'render_conversation'
    },
    
    initialize() {
        this.cable = dm_channel_helper.joinChannel(Helper.userId());
        this.render();
    },

    async fetchUsers() {
        await Helper.fetch(this.userCol).then(function() {
            let current_user = Helper.current_user();
            let template = _.template($("#online-users-template").html())
            let output = template({'users':usercollection.toJSON(), 'current_user':current_user});
            $('#available-users').html(output);
        });
    },

    render_user_list() {
        this.fetchUsers();
        return this;
    },

    render_conversation(param){
        console.log($(param.currentTarget).text());
        //let valor = $(this).html();
        //console.log(valor);
    },

    render() {
        let self = this;
        let template = _.template($("#chats-template").html())
        this.$el.html(template);
        this.render_user_list();
        return self;
    },
});

export default chatView;