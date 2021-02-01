import Backbone from 'backbone'
import $ from 'jquery'
import _ from 'underscore'
import userscollection from '../../models/user'
import gameConnection from './../../../channels/playroom_channel.js'

let playroomView = Backbone.View.extend({
    el: '#content',
    collection: userscollection,
    room: 0,
    events: {
        "click .title" : "keyevent",
        "keydown": "keyevent",
    },
    initialize()
    {
        console.log("INIT playroomView");
    },

    render()
    {
        self = this;
        console.log("PlayroomView Rendering");
        let template = _.template($('#playroom-template').html());
        let output = template();
        this.$el.html(output);
        this.connect(1);
        this.$el.keypress(self.keyevent(13));
        window.addEventListener('keyup', self.keyevent(13))
        $('#spanfocus').focus();
    },
    connect(id)
    {
        this.room = id;
        this.cable = gameConnection.startGame(id);
    },
    keyevent(k){
        console.log(`HE clickeado ahorita`);
        this.cable.perform("keypress", {room: this.room,  key: k});
    }
});

export default playroomView;