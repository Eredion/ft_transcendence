import consumer from "./consumer"
import $ from 'jquery'
import Helper from "../packs/Helper";

let AvailableChatCable = {

  connect(){
    self = this;
    console.log("connecting to tournament...")
    let cable = consumer.subscriptions.create("AvailableChatChannel", {
      connected() {
        // Called when connected
      },
    
      disconnected() {
        // Called when the subscription has been terminated by the server
      },
    
      received(data) {
        if (data != Helper.current_user() && ($("#available-users").text().includes(data)) === false)
          $(document).trigger("render_user_list");
      }
    });
    return cable;
  }
}


export default AvailableChatCable