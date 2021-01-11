import _ from 'underscore'
import $ from 'jquery';
import Backbone from 'backbone'
import chatcol from '../models/chat'


let conversView = Backbone.View.extend({
    collection: chatcol,
	el: "#conversation",
	chatName: "default",
	buildChatName(a, b){
		let name = a < b ? a + '-' + b : b + '-' + a;
		this.chatName = name;
	},
	searchChat(name){

		let chat = this.collection.where({name: name})[0];
		return chat;
	},
    initialize(user_a, user_b){
		this.buildChatName(user_a, user_b);
		this.render();
    },
    render(){
		let template = _.template($("#conversation_template").html());
		let message_history = this.searchChat(this.chatName).get("messages");
        let output = template({'message_history': message_history});
        this.$el.html(output);
        return this;
    }
});

export default conversView;

