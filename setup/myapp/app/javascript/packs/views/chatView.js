import _ from 'underscore'
import $ from 'jquery';
import Backbone from 'backbone'
import chatcol from '../models/chat'
import conversView from './conversationView'
import channelsView from './channelsView'
import Helper from '../Helper';
import dm_channel_helper from '../../channels/dm_channel'
import usercollection from '../models/user'
import AvailableChatCable from "../../channels/available_chat_channel"
let chatView = Backbone.View.extend({

    el: '#content',
    chatCol: chatcol,
    userCol: usercollection,
    events : {
        'click #online-user-button' : 'renderConversation'
    },
    
    initialize() {
        this.ownCable = dm_channel_helper.joinChannel(Helper.userId());
        this.commonCable = AvailableChatCable;
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

    buildChatName(user1, user2) {
        let userID1 = Helper.getIdbyNickname(user1);
        let userID2 = Helper.getIdbyNickname(user2);
        let chatName = Math.min(userID1, userID2) + "-" + Math.max(userID1, userID2)
        return (chatName)
    },

    renderUserList() {
        this.fetchUsers();
        return this;
    },

    renderMessages(conversation) {
        self = this;
        let chat = conversation;
        console.log("Renderizo messages");
        let template = _.template($("#chat_view_template").html())
        let output = template({'messages':chat.get("messages")});
        $('#chat_view').html(output);
        let template2 = _.template($("#chat-msg-imput-template").html());
        let output2 = template2({'chat': chat});
        $('#chat-input-form-wrapper').html(output2);
        $('#send-chat-message-button').click(function(){
            if (($('#input-msg-chat-form').val()).length === 0)
            {
                return;
            }
            setTimeout(async function(){
                $('#chat_view').append(`<div class="chat_message bg-light p-2 rounded-pill mt-1">
                <div class="message_author d-inline text-primary">${Helper.current_user()} :</div>
                <div class="message_content d-inline text-dark"> ${$('#input-msg-chat-form').val()}</div>
                </div>`);
                $('#input-msg-channel-form').focus();
                $('#input-msg-chat-form').val("");
                $('#input-msg-chat-form').focus();
            }, 1);
        });
        $("#input-msg-chat-form").submit(function(event) {
            event.preventDefault();
          }); 
    },

    async renderConversation(param){
        let self = this;
        this.fetchUsers();
        let userNick = $(param.currentTarget).text().trim();
        $('#chat-name-title').text(userNick);
        let chatName = this.buildChatName(Helper.current_user(), userNick);
        await Helper.fetch(this.chatCol).then(function() {
            if (self.chatCol.where({ name: chatName}).length === 0) {
                console.log("El chat no existe, tengo que crearlo");
                self.commonCable.perform('create_chat', {name: chatName})
                self.renderConversation(param)  
            }
            else
            {
                let chat = self.chatCol.where({ name: chatName})[0];
                chat.dest = userNick;
                self.renderMessages(chat);
            }
        });
    },

    render() {
        let self = this;
        let template = _.template($("#chats-template").html())
        this.$el.html(template);
        this.renderUserList();
        return self;
    },
});

export default chatView;