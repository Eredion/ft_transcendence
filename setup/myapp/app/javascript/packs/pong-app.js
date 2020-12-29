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
        //console.log(this.router);
        
        if (Backbone.History.started === false) {
            Backbone.history.start();
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

export default App
