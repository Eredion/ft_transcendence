import _ from 'underscore'
import $ from 'jquery';
import Backbone from 'backbone'

let chatView = Backbone.View.extend({
    initialize() {
        console.log("Chat View initialize");
        this.template_chat = $('script[name="chat"]').html(); // views/chat/_chat.html.erb
       

    },

    render() {
        $("#content").html(_.template(this.template_chat));

        return this;
    }
});

export default chatView;
