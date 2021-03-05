import consumer from "./consumer"
import $ from 'jquery'

const Guild = {}

$(function () {

  class GuildChannel {

    constructor() {
      this.cable = null;
    }

    connect(guild, callback, view) {
      
      if (this.cable) {
        return ;
      }
      const self = this;
      this.cable = consumer.subscriptions.create({
        channel: "GuildChannel",
        id: guild
      },
      {
        connected() {
          // Called when the subscription is ready for use on the server
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

  Guild.channel = new GuildChannel();

});

export default Guild;

