import $ from 'jquery'
import _ from 'underscore'
import Backbone from 'backbone'
import Pong from '../pong-game'


class pongView extends Backbone.View {

    get el() {
        return $("#content")
    }

    get events() {
        return {
            "click #active-game": "startPong"
        }
    }

    startPong(e) {
        console.log("Button pressed")
        //drawLoop();
        const button = document.getElementById("active-game");
        button.disabled = true;
        button.style.display = "none";
        document.getElementById("cnv").focus();
        this.pong.listen()
        this.pong.gameLoop()
    }

    initialize() {
        console.log("Pong View initialize");
        this.template_game = $('script[name="game"]').html(); // views/pong/_game.html.erb
        this.render()
        this.pong = new Pong()
    }

    render() {
        $("#content").html(_.template(this.template_game));
		return this;
    }
};

export default pongView;
