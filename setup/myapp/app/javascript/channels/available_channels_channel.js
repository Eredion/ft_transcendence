import consumer from "./consumer"

let availablechannelsChannel = {

  connect(){
    self = this;
    console.log("connecting to tournament...")
    let cable = consumer.subscriptions.create(
      {channel: "AvailableChannelsChannel"}, 
      {
        connected() {
          
          console.log("connected to available_channels channel")
          // Called when the subscription is ready for use on the server
        },

        disconnected() {
          console.log("disconnected from available_channels channel")
          // Called when the subscription has been terminated by the server
        },
      
        received(data) {
          console.log("receiving)");
          console.log("DATA RECEIVED" + data);
          if (data === 'force_render_channel_list')
          {
            $(document).trigger("update_channels_event")
            console.log("someone has left a channel")
            return;
          }
          if (data.action != undefined && data.action.length > 0)
          {
            if (data.action === "kick")
            {
              $(document).trigger("kick", [data.user_id, data.channel]);
            }
            else if (data.action === 'force_render_all')
            {
              $(document).trigger("render_full_view", [data.channel])
            }
            return
          }
          if ($("#available-channel-buttons").find(data).length > 0)
            return;
          let channel = `<a  class="btn btn-dark btn-sm render-channel-button" id="online-user-button" data-channel="${data}" >
          ${data}
      
      </a>`
              $('#available-channel-buttons').append(channel);
          // Called when there's incoming data on the websocket for this channel
        }
    });
    return cable;
  }
}


export default availablechannelsChannel