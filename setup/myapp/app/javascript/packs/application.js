require("@rails/ujs").start();
require("@rails/activestorage").start();
require("channels");
require("bootstrap");
var jQuery = require("jquery");
var underscore = require("underscore");
require("backbone");

global.$ = global.jQuery = jQuery;
window.$ = window.jQuery = jQuery;
global._ = global.underscore = underscore;

//App Entrypoint
import App from './pong-app.js'

$(function() {

    var MyApp = new App();

    $(document).on("click", "a[href^='/']", function(event) {

        var href = $(event.currentTarget).attr('href')
            //chain 'or's for other black list routes
        var passThrough = href.indexOf('sign_out') >= 0
            // Allow shift+click for new tabs, etc.
        if (!passThrough && !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
            //event.preventDefault();
            // Remove first slash for backbone route match right
            var url = href.replace(/^\//, '')
                // Instruct Backbone to trigger routing events
            MyApp.navigate(url);
            return false
        }
    });
});