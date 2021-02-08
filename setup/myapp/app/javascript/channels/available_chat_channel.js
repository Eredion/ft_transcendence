import consumer from "./consumer"

consumer.subscriptions.create("AvailableChatChannel", {
  connected() {
    console.log("Listening to available_channels");
  },

  disconnected() {
    // Called when the subscription has been terminated by the server
  },

  received(data) {
    $('#available-users-buttons').append(`<a href="#users/${data}" class="btn btn-danger btn-sm" id="online-user-button">
    ${data}</a>`);
  }
});
