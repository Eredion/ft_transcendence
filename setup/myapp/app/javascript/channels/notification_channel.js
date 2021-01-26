import consumer from "./consumer"
import Helper from "../packs/Helper"

consumer.subscriptions.create({
    channel: "NotificationChannel"
  },
  {
  connected() {
    // Called when the subscription is ready for use on the server
    console.log('connected function from notification_channel.js')
  },

  disconnected() {
    // Called when the subscription has been terminated by the server
    console.log('disconnected function from notification_channel.js')
  },

  received(data) {
    // Called when there's incoming data on the websocket for this channel
    console.log('received function from notification_channel.js')
    Helper.notification(data['title'], data['body']);
  }
});
