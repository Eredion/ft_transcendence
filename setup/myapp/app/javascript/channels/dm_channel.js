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
          // Called when there's incoming data on the websocket for this channel
        }
      }
    );
    cable.userid = userID;
    return cable;
  }
}

export default dm_channel_helper;