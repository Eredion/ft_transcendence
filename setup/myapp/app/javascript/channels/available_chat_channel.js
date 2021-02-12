import consumer from "./consumer"
import $ from 'jquery'
import Helper from "../packs/Helper";

let AvailableChatCable = consumer.subscriptions.create("AvailableChatChannel", {
  connected() {
    // Called when connected
  },

  disconnected() {
    // Called when the subscription has been terminated by the server
  },

  received(data) {
    if (data != Helper.current_user() && ($("#available-users").text().includes(data)) === false)
    {
      $('#available-users-buttons').append(`<a href="#users/${data}" class="btn btn-danger btn-sm" id="online-user-button">
        ${data}</a>`);
    }
  }
});

export default AvailableChatCable;

