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
        this.append_click_event().then(function() {
            for (let i = 0; i < chatcol.length; i++) {
                let namestr = chatcol.models[i].get("name");
                $('#' + namestr + "-button").on("click", function() {
                    let conversview = new conversView();
                    //console.log(namestr);
                    conversview.setName(namestr);
                    conversview.render();
                    //conversview.on("change:chatName", conversview.render());
                });

            }
        });

        return this;
    },
    async append_click_event() {
        await Helper.fetch(chatcol);
    }
});

export default chatView;