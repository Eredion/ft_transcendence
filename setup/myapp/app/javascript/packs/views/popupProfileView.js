import Backbone from 'backbone'
import $ from 'jquery'
import _ from 'underscore'
import Helper from '../Helper'
import channelcol from '../models/channel'
import consumer from "./../../channels/consumer"
import userscollection from '../models/user.js'
let PopupProfileView = Backbone.View.extend({
    el: '#popup1',
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
            let output=
                "<div><a class=\"btn btn-dark\">" + "Challenge " + this.model.get("nickname")+ "</a></div>" +
                "<div><a href =\"#users/"+this.model.get("id")+"\" class=\"btn btn-dark\">" + "Go to " + this.model.get("nickname")+ " profile</a></div>" +
                "<div class=\"blockbutton\" ><a href =\"#users/"+this.model.get("id")+"\" class=\"btn btn-danger\">" + "Block " + this.model.get("nickname")+ " profile</a></div>";

            this.$el.html(output);
            //this.$el.append("<div><a href =\"#users/"+this.model.get("id")+"\" class=\"btn btn-dark\">" + "Go to " + this.model.get("nickname")+ " profile</a></div>");
        }
        else{
            this.$el.html("<div><a href =\"#users/"+this.model.get("id")+"\" class=\"btn btn-dark\">" + "Go to your profile</a></div>");

        }
        $('#popup-user-avatar').html(`<img src="${this.model.toJSON().avatar.thumb.url}"></img>`)
    }
});


export default PopupProfileView;