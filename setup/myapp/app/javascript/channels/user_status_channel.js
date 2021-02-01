import consumer from "./consumer"
import $ from 'jquery'
//import userscollection from "../packs/models/user"

const UserStatus = {}

$(function () {

  class UserStatusChannel {

    constructor() {
      this.cable = null;
    }

    connect() {

      if (this.cable) {
        return ;
      }
      const self = this;
      this.cable = consumer.subscriptions.create({
        channel: "UserStatusChannel"
      },
      {
        connected() {
          // Called when the subscription is ready for use on the server
          console.log('UserStatusChannel connected')
        },
        disconnected() {
          // Called when the subscription has been terminated by the server
          console.log('UserStatusChannel disconnected')
          self.disconnect()
        },
        received(data) {
          // Called when there's incoming data on the websocket for this channel
          console.log('UserStatusChannel received')
          console.log('user'+ data['id'] + ' status ' + data['status'])
          //console.log(Backbone.history.getFragment()) comprobar en que ruta estamos (users/:id) si es el mismo id actualizamos y render()
        }
      });

    }

    disconnect() {
      if (this.cable) {
        consumer.subscriptions.remove(this.cable);
        this.cable = null;
      }
    }
  }

  UserStatus.channel = new UserStatusChannel();

});
  
export default UserStatus;
