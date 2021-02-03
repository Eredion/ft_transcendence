import consumer from "./consumer"
import $ from 'jquery'
import Helper from "../packs/Helper"

const Matchmaking = {}

$(function () {

  class MatchmakingChannel {

    constructor() {
      this.cable = null;
    }

    connect(user) {
      
      if (this.cable) {
        return ;
      }
      const self = this;
      this.cable = consumer.subscriptions.create({
        channel: "MatchmakingChannel",
        id: user
      },
      {
        connected() {
          // Called when the subscription is ready for use on the server
          console.log('connected function from matchmaking_channel.js')
          this.perform('search_game')
        },
    
        disconnected() {
          // Called when the subscription has been terminated by the server
          self.disconnect()
        },
    
        received(data) {
          // Called when there's incoming data on the websocket for this channel
          console.log('received function from matchmaking_channel.js')
          switch (data.action) {
            case 'searching':
              console.log('Waiting for opponent')
              break;
            case 'game_found':
              console.log('Game found, opponent ' + data.opponent)
              alert('Game found, opponent ' + data.opponent)
              break;
          }
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
