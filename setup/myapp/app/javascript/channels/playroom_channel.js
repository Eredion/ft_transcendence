import consumer from "./consumer"

let gameConnection = {
  startGame(id){
    console.log("aqui tengo un id " + id );
    let cable = consumer.subscriptions.create("PlayroomChannel", {
      room: id,
      connected() {
        console.log("connected to room: "+ this.room);

        // Called when the subscription is ready for use on the server
      },

      disconnected() {
        console.log("disconnected to room: "+ this.room);
        // Called when the subscription has been terminated by the server
      },
    
      received(data) {
        console.log(`Received ${data} from playromm ${this.room}`);
        // Called when there's incoming data on the websocket for this channel
      },
    });
    console.log("voy a enviar")
    cable.send("HE LLEGAO PESCAO");
    console.log("ya he enviado")
    return cable;
  },

};

export default gameConnection;