import consumer from "./consumer"
import $ from 'jquery'

const Matches = {}

$(function () {

  class MatchChannel {

    constructor() {
      this.cable = null;
    }

    connect(match, callback, view) {
      
      if (this.cable) {
        return ;
      }
      const self = this;
      this.cable = consumer.subscriptions.create({
        channel: "MatchChannel",
        id: match
      },
      {
        connected() {
          // Called when the subscription is ready for use on the server
          this.perform('start', { id: match })
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

    perform(server_func, params) {
      this.cable.perform(server_func, params)
    }

    disconnect() {
      if (this.cable) {
          consumer.subscriptions.remove(this.cable);
          this.cable = null;
      }
    }

  }

  Matches.channel = new MatchChannel();

});

export default Matches;

