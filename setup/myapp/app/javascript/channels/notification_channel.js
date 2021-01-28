import consumer from "./consumer"
import Helper from "../packs/Helper"
import Notification from "../packs/views/notificationView"

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
    Helper.notification();
    let format = data['data']
    if (data['type'] == 'Friend Request') {
      format["nickname"] = data['from']
    }
    Notification.view.addNotification(format)
  }
});
