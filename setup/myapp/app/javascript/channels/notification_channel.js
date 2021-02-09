import consumer from "./consumer"
import $ from 'jquery'
import Helper from "../packs/Helper"
import Notification from "../packs/views/notificationView"
import Friends from '../packs/views/friendsView'

const Notifications = {}

$(function () {

  class NotificationChannel {

    constructor() {
      this.cable = null;
    }

    connect() {
      
      if (this.cable) {
        return ;
      }
      const self = this;
      this.cable = consumer.subscriptions.create({
        channel: "NotificationChannel"
      },
      {
        connected() {
          // Called when the subscription is ready for use on the server
          console.log('connected function from notification_channel.js')
        },
    
        disconnected() {
          // Called when the subscription has been terminated by the server
          self.disconnect()
        },
    
        received(data) {
          // Called when there's incoming data on the websocket for this channel
          console.log('received function from notification_channel.js')
          if (data['action'] === 'notification') {
            Helper.notification('New notification received.');
            let format = data['data']
            if (data['type'] == 'Friend Request') {
              format["nickname"] = data['from']
            }
            Notification.view.addNotification(format)
          } else if (data['action'] === 'update_friends') {
            Friends.view.update()
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

  Notifications.channel = new NotificationChannel();

});


export default Notifications;
