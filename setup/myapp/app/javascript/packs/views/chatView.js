import _ from 'underscore'
import Backbone from 'backbone'
import usercollection from '../models/user.js'
import Helper from '../Helper.js'
import uuu from '../models/chat'

class chatView extends Backbone.View {

    initialize() {
        console.log("Chat View initialize");
        this.template_chat = $('script[name="chat"]').html(); // views/chat/_chat.html.erb
    }

    render() {
        $("#content").html(_.template(this.template_chat));

        return this;
    }
};

export default chatView;