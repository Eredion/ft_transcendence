import _ from 'underscore'
import $ from 'jquery';
import Backbone from 'backbone'
import chatcol from '../models/chat'
import Helper from '../Helper';


let conversView = Backbone.View.extend({
    collection: chatcol,
	el: "#conversation",
	chatName: "default",
	buildChatName(a, b){
		let name = a < b ? a + '-' + b : b + '-' + a;
		this.chatName = name;
	},
	searchChat(name){
		console.log("busco chat con nombre: " + name);
		let chat = this.collection.where({name: name})[0];
		return chat;
	},
    async initialize(){
		//console.log("Dentro de conver, me llegan los ids:" + user_a, + ", " + user_b)
		await Helper.fetch(this.collection);
		this.buildChatName(1, 3);
		this.render();
    },
    render(){
        let template = _.template($('script[name="conversation_template"]').html());
//		let template = _.template($("#conversation_template").html());
		let message_history = this.searchChat(this.chatName).get("messages");
        let output = template({'message_history': message_history});
        this.$el.html(output);
        return this;
    }
});

export default conversView;
