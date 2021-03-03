import consumer from "./consumer"
import $ from 'jquery'
import Helper from "../packs/Helper"

const ActiveMatches = {}

$(function () {

  class ActiveMatchesChannel {

    constructor() {
      this.cable = null;
    }

    connect(callback, view) {

      if (this.cable) {
        return ;
      }
      const self = this;
      this.cable = consumer.subscriptions.create({
        channel: "ActiveMatchesChannel"
      },
      {
        connected() {
          console.log('ActiveMatchesChannel connected')
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

  ActiveMatches.channel = new ActiveMatchesChannel();

});
  
export default ActiveMatches;
