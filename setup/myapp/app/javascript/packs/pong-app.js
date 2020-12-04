import Backbone from "backbone"
import Workspace from "./routes.js"

class App {
    constructor() {
        console.log("App initialize");

        new Workspace();

        if (Backbone.History.started === false) {
            Backbone.history.start({pushState: true});
        }
    }
}

export default App
