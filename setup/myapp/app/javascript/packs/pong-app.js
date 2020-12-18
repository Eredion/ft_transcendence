import Backbone from "backbone"
import Workspace from "./routes.js"
import $ from "jquery"

$.ajaxPrefilter( function( options ) {
    options.url = 'http://127.0.0.1/' + options.url;
    console.log("request to " + options.url);
});

class App {

    constructor() {
        console.log("App initialize");
        
        this.router = new Workspace();
        console.log(this.router);
        
        if (Backbone.History.started === false) {
            Backbone.history.start({pushState: true});
            //Backbone.history.loadUrl(Backbone.history.fragment);
            //Backbone.history.start();
            console.log('Starting Backbone History... state: ' + Backbone.History.started);
        }
    }

    navigate (url) {
        this.router.navigate(url, { trigger: true });
    }

}

export default App
