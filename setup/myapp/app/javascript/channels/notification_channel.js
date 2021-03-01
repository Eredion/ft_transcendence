import consumer from "./consumer"
import $ from 'jquery'
import _ from 'underscore'
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
			console.log(data);
			console.log('received function from notification_channel.js')
			if (data['action'] === 'notification') {
				Helper.notification('New notification received.');
				let format = data['data']
				if (data['type'] === 'challenge') {
					format["nickname"] = data['from']
					let notif_count = parseInt($('#notification-count').text())
					$('#notification-count').text(parseInt($('#notification-count').text()) + 1)
					let template = _.template($("#challenge_notif_template").html())
					let output = template({'from':data['from'], 'id': data.data.from, currentuser: Helper.userId()})
					if (notif_count === 0)
						$('#notification-list').html(output) 
					else
						$('#notification-list').append(output)
					return;
				}
				Notification.view.addNotification(format)
			} else if (data['action'] === 'update_friends') {
				Friends.view.update()
			} else if (data['action'] === 'alert') {
				Helper.custom_alert("danger", data['message'])
			} else if (data['action'] === 'banned') {
				Helper.custom_alert('danger', 'You have been banned.')
				setTimeout(async function(){
					self.log_off()
				}, 500);
			} else if (data['action'] === 'close_session') {
				self.log_off()
			}
		},


        });
    }

    disconnect() {
      if (this.cable) {
          consumer.subscriptions.remove(this.cable);
          this.cable = null;
      }
	}

	async log_off() {
		await Helper.ajax('DELETE', 'sign_out', '')
		window.location.href = ''
	}
  }

  Notifications.channel = new NotificationChannel();

});


export default Notifications;
