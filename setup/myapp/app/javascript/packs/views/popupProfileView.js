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
        this.$el.append("<button class=\"button btn-sm\">" + "Challenge " + this.model.get("nickname")+ "</button>");
       
    }
});


export default PopupProfileView;