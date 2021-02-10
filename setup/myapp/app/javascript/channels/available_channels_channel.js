import consumer from "./consumer"

let newchannelscable = consumer.subscriptions.create("AvailableChannelsChannel", {
  connected() {
    console.log("Listening to available_channels");
    // Called when the subscription is ready for use on the server
  },

  disconnected() {
    // Called when the subscription has been terminated by the server
  },

  received(data) {
    console.log("receiving)");
    console.log("DATA RECEIVED" + data);
    if ($("#available-channel-buttons").find(data).length > 0)
      return;
    $('#available-channel-buttons').append(`<a href="#channels/${data}" class="btn btn-danger btn-sm" id="online-user-button">
    ${data}</a>`);
    // Called when there's incoming data on the websocket for this channel
  }
});

export default newchannelscable