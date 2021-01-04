import _ from 'underscore'
import Backbone from 'backbone'
import userscol from '../collections/users.js'
console.log()
class chatView extends Backbone.View {

    initialize() {
        console.log("Chat View initialize");
        this.template_chat = $('script[name="chat"]').html(); // views/chat/_chat.html.erb
    }

    render() {
        $("#content").html(_.template(this.template_chat));
        $("#content").prepend("<div><h2>Hola</h2></div>");
        return this;
    }
};

export default chatView;