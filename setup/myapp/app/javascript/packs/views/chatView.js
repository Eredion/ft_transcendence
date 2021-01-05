import _ from 'underscore'
import Backbone from 'backbone'
import User from '../models/user.js'
import Helper from '../Helper.js'


class chatView extends Backbone.View {

    initialize() {
        console.log("Chat View initialize");
        this.template_chat = $('script[name="chat"]').html(); // views/chat/_chat.html.erb
    }

    render() {
        $("#content").html(_.template(this.template_chat));
        $("#content").prepend("<div id = \"perfil\" >Hola</div>");

        $("#perfil").html(usuario.get("nickname")+ " - test");
        return this;
    }
};

export default chatView;