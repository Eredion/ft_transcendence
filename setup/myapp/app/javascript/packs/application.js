import 'bootstrap'
import Workspace from "./routes.js"
require("@rails/ujs").start();
require("turbolinks").start();
require("@rails/activestorage").start();
require("channels");
require("bootstrap");
var jQuery = require("jquery");
var underscore = require("underscore");
require("backbone");
global.$ = global.jQuery = jQuery;
window.$ = window.jQuery = jQuery;
global._ = global.underscore = underscore;

class App {

    constructor() {
        console.log("App initialize");
        
        this.router = new Workspace();
        console.log(this.router);
        
        if (Backbone.History.started === false) {
            Backbone.history.start({pushState: true});
            /*
                with the pushState: true option, rails and backbone synchronize its route,
                so if for example the /chat route is accessed (it exists in backbone, it does not in rails)
                it fails to reload the page.
                without this option backbone captures the path with #,
                reloading the page works fine.
                But it works badly with the login page since it does not detect the # and goes into the default route
                **It should be used without the pushState option fixing the failure of the login page**
            */
            console.log('Starting Backbone History...');
        }
    }

    navigate (url) {
        this.router.navigate(url, { trigger: true });
    }
}

$(function() {

    var myApp = new App();

    $(document).on("click", "a[href^='/']", function (event) {
    
        var href = $(event.currentTarget).attr('href')
        //chain 'or's for other black list routes
        var passThrough = href.indexOf('sign_out') >= 0
        // Allow shift+click for new tabs, etc.
        if (!passThrough && !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
            //event.preventDefault();
            // Remove leading slashes and hash bangs (backward compatablility)
            var url = href.replace(/^\//,'').replace('\#\!\/','')
            // Instruct Backbone to trigger routing events
            myApp.navigate(url);
            //window.location.pathname = url;
            return false
        }
    });
});