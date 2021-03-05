import consumer from "./consumer"

let tournamentChannel = {

  connect(user, callback, view){
    self = this;
    let cable = consumer.subscriptions.create(
      {channel: "TournamentChannel"}, 
      {
        connected() {
          
          // Called when the subscription is ready for use on the server
        },

        disconnected() {
          // Called when the subscription has been terminated by the server
        },
      
        received(data) {
          callback.bind(view)(data)
          // Called when there's incoming data on the websocket for this channel
        }
    });
    return cable;
  }
}

export default tournamentChannel;
