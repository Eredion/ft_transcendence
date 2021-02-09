import consumer from "./consumer"
import $ from 'jquery'
import Helper from "../packs/Helper";

consumer.subscriptions.create("AvailableChatChannel", {
  connected() {
    console.log("Listening to available_chats");
  },

  disconnected() {
    // Called when the subscription has been terminated by the server
  },

  received(data) {
    if (data != Helper.current_user && $('.btn btn-danger btn-sm').find(Helper.current_user) === undefined)
    {
      $('#available-users-buttons').append(`<a href="#users/${data}" class="btn btn-danger btn-sm" id="online-user-button">
        ${data}</a>`);
    }
  }
});
