import _ from 'underscore'
import $ from 'jquery';
import Backbone from 'backbone'
import chatcol from '../models/chat'


let conversView = Backbone.View.extend({
    collection: chatcol,
    el: "#conversation",

    initialize(){
        console.log("conversation initialize");
        this.render();
    },
    render(){
        let template = _.template($("#conversation_template").html());
        let chat_id = 1;
        console.log("encontrando:" + this.collection.length);
        let message_history = this.collection.get(1).get("messages");
        let output = template({'message_history':message_history.toJSON()}); 
        this.$el.html(output);
        return this; 
    }
});

export default conversView;