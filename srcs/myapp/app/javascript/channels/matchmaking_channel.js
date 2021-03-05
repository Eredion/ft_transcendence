import consumer from "./consumer"
import $ from 'jquery'
import Helper from "../packs/Helper"

const Matchmaking = {}

$(function () {

  class MatchmakingChannel {

    constructor() {
      this.cable = null;
    }

    connect(user, callback, view, action = 'quick_game', peer = undefined) {

      if (this.cable) {
        return ;
      }
      const self = this;
      this.cable = consumer.subscriptions.create({
        channel: "MatchmakingChannel",
        id: user,
        action: action,
        peer: peer,
      },
      {
        connected() {
          // Called when the subscription is ready for use on the server
          if (action === 'quick_game' || action === 'ranked_game' || action === 'tournament_game' || action === 'war_game')
            this.perform(action)
          else if (action === 'wait_peer')
            this.perform(action, {"peer": peer, "from": this.id})
          else if (action === 'accept_peer')
            this.perform(action, {"peer": peer, "from": this.id})
          },

        disconnected() {
          // Called when the subscription has been terminated by the server
          self.disconnect()
        },

        received(data) {
          // Called when there's incoming data on the websocket for this channel
          callback.bind(view)(data)
        }
      });
    }

    disconnect() {
      if (this.cable) {
          consumer.subscriptions.remove(this.cable);
          this.cable = null;
      }
    }

  }

  Matchmaking.channel = new MatchmakingChannel();

});

export default Matchmaking;
