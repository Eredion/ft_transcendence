import _ from 'underscore'
import Backbone from 'backbone'
import userscollection from '../models/user.js'



let userList = Backbone.View.extend({
    collection: userscollection,
    el: "#online-users",
    
    initialize() {
        console.log("Chat View initialize");
        this.render();
    },

    render() {
        let template = _.template($("#online_user_template").html());
        let output = template({'online_users':this.collection.toJSON()});
        this.$el.html(output);
        return this;
    }
});



export default userList;