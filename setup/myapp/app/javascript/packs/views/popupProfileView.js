import Backbone from 'backbone'
import $ from 'jquery'
import _ from 'underscore'
import Helper from '../Helper'
import channelcol from '../models/channel'
import consumer from "./../../channels/consumer"
import userscollection from '../models/user.js'
let PopupProfileView = Backbone.View.extend({
    el: '.popup-content',
    userCol: userscollection,
    
    async fetchUsers() {
        self = this;
        await Helper.fetch(this.userCol).then(function() {
            self.render();
        })
    },
    initialize(name) {
        if(!name)
            return;
        this.username = name
        this.fetchUsers();
    },
    render(){
        console.log(`searching for ${this.username}`)
        this.model = this.userCol.where({ nickname: this.username })[0];
        console.log("ESTE USERNAME" + this.username)
        console.log("ESTE USERNAME" + Helper.current_user())
        
        if (this.username != Helper.current_user())
        {
            
            this.$el.html("<div><a class=\"btn btn-dark\">" + "Challenge " + this.model.get("nickname")+ "</a></div>");
            this.$el.html("<div><a href =\"#users/"+this.model.get("id")+"\" class=\"btn btn-dark\">" + "Go to " + this.model.get("nickname")+ " profile</a></div>");
        }
        else{
            this.$el.html("<h3>This is yourself!</h3>");
        }
        $('#popup-user-avatar').html(`<img src="${this.model.toJSON().avatar.thumb.url}"></img>`)
    }
});


export default PopupProfileView;