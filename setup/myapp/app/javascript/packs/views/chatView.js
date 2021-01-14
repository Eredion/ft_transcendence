import _ from 'underscore'
import $ from 'jquery';
import Backbone from 'backbone'
import chatcol from '../models/chat'
import conversView from './conversationView'
import Helper from '../Helper';

let chatView = Backbone.View.extend({
    initialize() {
        console.log("Chat View initialize");
        this.template_chat = $('script[name="chat"]').html(); // views/chat/_chat.html.erb

    },

    render() {
        $("#content").html(_.template(this.template_chat));
        this.append_click_event()

        return this;
    },
    async append_click_event() {
        await Helper.fetch(chatcol).then(function() {
            for (let i = 0; i < chatcol.length; i++) {
                let namestr = chatcol.models[i].get("name");
                $('#' + namestr + "-button").on("click", function() { // append click event to every button of the online users.

                    let nametag = $('#' + namestr + "-button").val();
                    console.log("VALUE FOUND: " + nametag);
                    $('#current-conversation').text(nametag);
                    let conversview = new conversView();
                    conversview.setName(namestr);
                    conversview.on("change:chatName", conversview.render());
                });

            }
        });
    },
});

export default chatView;