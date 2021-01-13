import _ from 'underscore'
import Backbone from 'backbone'
import userscollection from '../models/user.js'
import Helper from '../Helper.js';




let userList = Backbone.View.extend({
    collection: userscollection,
    el: "#online-users",

    async initialize() {
        console.log("UserList View initialize");
        await Helper.fetch(this.collection)
        this.render();
    },

    render() {
        let template = _.template($('script[name="online_user_template"]').html());
        console.log("TEM: " + template);
        let output = template({ 'online_users': this.collection.toJSON() });
        this.$el.html(output);
        this.create_chat();
        return this;
    },

    create_chat: async function() {
        /* e.preventDefault();
        e.stopImmediatePropagation(); */
        try {
            let chat_id = current_user.id;
            console.log(chat_id + "CHATID");
        } catch (err) {
            console.log("Create chat error: " + err);
        }
    },
});

export default userList;