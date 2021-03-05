import consumer from "./consumer"
import $ from 'jquery'
import Helper from "../packs/Helper"

const AvailableGuilds = {}

$(function () {

  class AvailableGuildsChannel {

    constructor() {
      this.cable = null;
    }

    connect(callback, view) {

      if (this.cable) {
        return ;
      }
      const self = this;
      this.cable = consumer.subscriptions.create({
        channel: "AvailableGuildsChannel"
      },
      {
        connected() {
        },
        disconnected() {
          self.disconnect()
        },
        received(data) {
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

  AvailableGuilds.channel = new AvailableGuildsChannel();

});
  
export default AvailableGuilds;
