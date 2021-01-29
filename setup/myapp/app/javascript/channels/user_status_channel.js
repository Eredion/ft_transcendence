import consumer from "./consumer"
import userscollection from "../packs/models/user"

consumer.subscriptions.create({
    channel: "UserStatusChannel"
  },
  {
  connected() {
    // Called when the subscription is ready for use on the server
    console.log('UserStatusChannel connected')
  },

  disconnected() {
    // Called when the subscription has been terminated by the server
    console.log('UserStatusChannel disconnected')
  },

  received(data) {
    // Called when there's incoming data on the websocket for this channel
    console.log('UserStatusChannel received')
    console.log('user'+ data['id'] + ' status ' + data['status'])
  }
});
