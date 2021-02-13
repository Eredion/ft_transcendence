import _ from 'underscore'
import $ from 'jquery';
import Backbone from 'backbone'
import chatcol from '../models/chat'
import Helper from '../Helper';
import usercollection from '../models/user'
import AvailableChatCable from "../../channels/available_chat_channel"
import consumer from '../../channels/consumer'

let chatView = Backbone.View.extend({

    el: '#content',
    chatCol: chatcol,
    userCol: usercollection,

    initialize() {
		this.ownCable = consumer.subscriptions.subscriptions.find(el => (el.identifier.includes(`"DmChannel\",\"userID\":${Helper.userId()}`)));
        this.commonCable = AvailableChatCable;
        return this;
    },

	greenUsers() {
		for (let i in Helper.data.newMsg)
		{
            $(`[data-author=${Helper.data.newMsg[i]}]`).removeClass('btn btn-dark btn-sm').addClass('btn btn-success btn-sm');
		}
	},
    async fetchUsers() {
		self = this;
        await Helper.fetch(this.userCol).then(function() {
            let current_user = Helper.current_user();
            let template = _.template($("#online-users-template").html())
            let output = template({'users':usercollection.toJSON(), 'current_user':current_user});
            $('#available-users').html(output);
			self.greenUsers();
        });
        return this;
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
                <div class="message_content d-inline text-dark">${$('#input-msg-chat-form').val()}</div>
                </div>`);
                $('#input-msg-channel-form').focus();
                $('#input-msg-chat-form').val("");
                $('#input-msg-chat-form').focus();
            }, 1);
        });
        $("#input-msg-chat-form").submit(function(event) {
            event.preventDefault();
          });
        return self;
    },

	ungreen(name) {
		$(`[data-author=${name}]`).removeClass('btn btn-success btn-sm').addClass('btn btn-dark btn-sm');
		Helper.data.newMsg.splice(Helper.data.newMsg.indexOf(name), 1);
	},

    async renderConversation(name){
        let self = this;
        $('#chat-name-title').text(name);
        let chatName = this.buildChatName(Helper.current_user(), name);
        await Helper.fetch(this.chatCol).then(function() {
            if (self.chatCol.where({ name: chatName}).length === 0) {
                self.commonCable.perform('create_chat', {name: chatName})
                self.renderConversation(name)
            }
            else
            {
                let chat = self.chatCol.where({ name: chatName})[0];
                chat.dest = name;
				self.ungreen(name);
                self.renderMessages(chat);
            }
        });
        return self;
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
