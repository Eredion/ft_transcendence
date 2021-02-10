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
    cables: [],
    
    initialize() {
        this.ownCable = dm_channel_helper.joinChannel(Helper.userId());
        this.commonCable = AvailableChatCable;
        //this.cables.push(this.ownCable);
        //this.cables.push(this.commonCable);
        //console.log("Joder que si esta definido!. Mide : " + this.cables.length)
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

    async renderConversation(param){
        
        let self = this;
        this.fetchUsers();
        let userNick = $(param.currentTarget).text().trim();
        let chatName = this.buildChatName(Helper.current_user(), userNick);
        await Helper.fetch(this.chatCol).then(function() {
            if (self.chatCol.where({ name: chatName}).length === 0) {
                console.log("El chat no existe, tengo que crearlo");
                self.commonCable.perform('create_channel', {name: chatName})
            }
            let chat = self.chatCol.where({ name: chatName})[0];
        });
        let cable2 = dm_channel_helper.joinChannel(Helper.getIdbyNickname(userNick));
        console.log(self.cables)
        self.cables.push(cable2);
        //if (self.cables.length === 0)
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