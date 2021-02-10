import consumer from "./consumer"
import Helper from "./../packs/Helper"

let dm_channel_helper = {
  joinChannel(username)
  {
    let cable = consumer.subscriptions.create(
      { 
        channel: "DmChannel",
        user: username,
      },
      {
        connected() {
          console.log(`subscription to dm ${username}`);
          console.log(`${Helper.userId()} es mi ID`);
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
    return cable;
  }
}

export default dm_channel_helper;