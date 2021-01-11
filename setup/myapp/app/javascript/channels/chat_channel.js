import consumer from "./consumer"

/* consumer.subscriptions.create("ChatChannel", {
    connected() {
        console.log("Connected to the room!");
        // Called when the subscription is ready for use on the server
    },

    disconnected() {
        // Called when the subscription has been terminated by the server
    },

    received(data) {
        console.log("receiving");
        console.log(data.content);
        $('#chatbox').append('<div class="message"> ' + data.content + '</div>');
        // Called when there's incoming data on the websocket for this channel
    }
}); */