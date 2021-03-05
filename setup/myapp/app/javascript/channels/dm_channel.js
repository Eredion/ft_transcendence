import consumer from "./consumer"
import Helper from "./../packs/Helper"
import Workspace from "../packs/routes"
let dm_channel_helper = {
  joinChannel(userID)
  {
    let cable = consumer.subscriptions.create(
      {
        channel: "DmChannel",
        userID: userID,
      },
      {
        connected() {
          // Called when the subscription is ready for use on the server
        },

        disconnected() {
          // Called when the subscription has been terminated by the server
        },

        received(data) {
          if($('#chat-name-title').text() === data.author)
          {
            $('#chat_view').append(`<div class="chat_message bg-light p-2 rounded-pill mt-1">
            <div class="message_author d-inline text-primary">
            <a href="#popup1" onclick="render_popup(this)">${data.author} :</a></div>
            <div class="message_content d-inline text-dark">${data.content}</div>
            </div>`);
            $('#input-msg-chat-form').focus();
          }
          else
          {
            $(`[data-author=${data.author}]`).removeClass('btn btn-dark btn-sm').addClass('btn btn-success btn-sm');
			      Helper.data.newMsg.push(data.author);
          }
        }
      }
    );
    cable.userid = userID;
    return cable;
  }
}

export default dm_channel_helper;
