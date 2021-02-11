import consumer from "./consumer"
import Helper from "./../packs/Helper"

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
          console.log(`subscription to dm ID: ${userID}`);
          // Called when the subscription is ready for use on the server
        },
      
        disconnected() {
          // Called when the subscription has been terminated by the server
        },
      
        received(data) {
          if($('#chat-name-title').text() === data.author)
          {
            $('#chat_view').append(`<div class="channel_message bg-light p-2">
            <div class="message_author d-inline text-primary">${data.author} :</div>
            <div class="message_content d-inline text-dark"> ${data.content}</div>
            </div>`);
            $('#input-msg-chat-form').focus();
          }
        }
      }
    );
    cable.userid = userID;
    return cable;
  }
}

export default dm_channel_helper;