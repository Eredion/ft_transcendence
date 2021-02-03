import consumer from "./consumer"
import $ from 'jquery'
import Friends from '../packs/views/friendsView'
import Helper from "../packs/Helper"

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
          console.log('UserStatusChannel connected')
        },
        disconnected() {
          self.disconnect()
        },
        received(data) {
          console.log('UserStatusChannel received')
          // the status is changed if the actual route match with the user who has changed the status
          if (Backbone.history.getFragment() === 'users/' + data['id']) {
            if (data['status'] == 0) {
              $('#user_status_profile').text('Offline')
            } else if (data['status'] == 1) {
              $('#user_status_profile').text('Online')
            }
          }
          // the status is changed in the friend view if the user is our friend
          let friend = Friends.collection.findWhere({ id: data['id'] })
          if (friend) {
              friend.set({status: data['status']})
              if (data['status'] === 1) {
                Helper.notification(friend.get('nickname') + ' is online.');
              }
              Friends.view.render_data()
          }
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
