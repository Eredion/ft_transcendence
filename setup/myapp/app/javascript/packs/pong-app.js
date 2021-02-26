import Backbone from "backbone"
import Workspace from "./routes.js"
import $ from "jquery"
import Notification from "./views/notificationView"
import Friends from "./views/friendsView"
import Helper from "./Helper.js";
import UserStatus from '../channels/user_status_channel'
import Notifications from '../channels/notification_channel'
import dm_channel from '../channels/dm_channel'

$.ajaxPrefilter( function( options ) {
    options.url = 'http://127.0.0.1/' + options.url;
    console.log("request to " + options.url);
});

//Override Backbone sync method to send the authenticity_token to Rails in ajax call
Backbone._sync = Backbone.sync;
Backbone.sync = function(method, model, options) {

  if (!options.noCSRF) {

    var beforeSend = options.beforeSend;
    // Set X-CSRF-Token HTTP header
    options.beforeSend = function(xhr) {
      var token = $('meta[name="csrf-token"]').attr('content');
      if (token) { xhr.setRequestHeader('X-CSRF-Token', token); }
      if (beforeSend) { return beforeSend.apply(this, arguments); }
    };
  }
  return Backbone._sync(method, model, options);
};

class App {

    constructor() {
        console.log("App initialize");

        this.router = new Workspace();

        if (Backbone.History.started === false) {
            Backbone.history.start();
        }

        if (Helper.logged() && Helper.valid()) {
            // global channels activation when user is logged
            Friends.view.update();
            UserStatus.channel.connect();
            Notifications.channel.connect();
			      dm_channel.joinChannel(Helper.userId());
        }
    }

    navigate (url) {
        this.router.navigate(url, { trigger: true });
    }
}

export default App
