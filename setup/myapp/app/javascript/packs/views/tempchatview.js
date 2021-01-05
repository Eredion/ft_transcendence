import _ from 'underscore'
import Backbone from 'backbone'
import userscollection from '../models/user.js'
import Helper from '../Helper.js'


let chatView = Backbone.View.extend({
    collection: userscollection,
    el: "div",
    id: "online-users",

    initialize() {
        console.log("Chat View initialize");
        this.render();
    },

    render() {
        this.online_users = $('script[name="online_user_template"]').html();
        console.log(this.online_users);
        this.template_chat = $('script[name="chat"]').html(); // views/chat/_chat.html.erb
        $("#content").html(_.template(this.template_chat));
        $("#content").html(_.template({'online_users':this.collection.toJSON()}));

        return this;
    }
});



export default chatView;