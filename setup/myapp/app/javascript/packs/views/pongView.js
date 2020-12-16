import _ from 'underscore'
import Backbone from 'backbone'


class pongView extends Backbone.View {

    initialize() {
        console.log("Pong View initialize");
        this.template_game = $('script[name="game"]').html(); // views/pong/_game.html.erb
        this.template_chat = $('script[name="chat"]').html(); // views/pong/_chat.html.erb
        this.render_game()
    }

    render_game() {
        $("#content").html(_.template(this.template_game));
		return this;
    }

    render_chat() {
        $("#content").find("#ft-chat").html(_.template(this.template_chat));
        return this;
    }
};

export default pongView;
