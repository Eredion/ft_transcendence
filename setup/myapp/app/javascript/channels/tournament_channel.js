import consumer from "./consumer"

let tournamentChannel = {

  connect(user, callback, view){
    self = this;
    console.log("connecting to tournament...")
    let cable = consumer.subscriptions.create(
      {channel: "TournamentChannel"}, 
      {
        connected() {
          
          console.log("connected to tournament channel")
          // Called when the subscription is ready for use on the server
        },

        disconnected() {
          console.log("disconnected from tournament channel")
          // Called when the subscription has been terminated by the server
        },
      
        received(data) {
          console.log(data);
          callback.bind(view)(data)
          // Called when there's incoming data on the websocket for this channel
        }
    });
    return cable;
  }
}

export default tournamentChannel;
