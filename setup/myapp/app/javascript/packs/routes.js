import Backbone from 'backbone'
import loginView from './views/loginView'

// Routes
class Workspace extends Backbone.Router {

    get routes() {
        return {
            "": "userLogin",
        }    
    }

    userLogin() {
        console.log("userLogin route");
        //var loginview = new loginView(); throw an error when user is login because is the same path (remove this later)
        //loginview.render();
    }

};

export default Workspace;
