import consumer from "./consumer"

consumer.subscriptions.create("ChannelMessagesChannel", {
  connected() {
    console.log("Listening to channel_messages");
    // Called when the subscription is ready for use on the server
  },

  disconnected() {
    // Called when the subscription has been terminated by the server
  },

  received(data) {
    console.log("receiving)");
    console.log("DATA RECEIVED" + data);
    // Called when there's incoming data on the websocket for this channel
  }
});
