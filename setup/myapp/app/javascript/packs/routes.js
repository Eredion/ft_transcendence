import Backbone from 'backbone'
import loginView from './views/loginView'
import registerView from './views/registerView'
import profileView from './views/profileView'
import pongView from './views/pongView'

// Routes
class Workspace extends Backbone.Router {

    get routes() {
        return {
            "": "pong",
            "sign_in": "userSignin",
            "sign_up": "userSignup",
            "users/:id": "userProfile"
        }
    }

    pong() {
        console.log("pong route");
        var pongview = new pongView();
        pongview.render_chat();
    }

    userSignin() {
        console.log("userSignin route");
        var signinView = new loginView();
        signinView.render();
    }

    userSignup() {
        console.log("userSignup route");
        var signupView = new registerView();
        signupView.render();
    }

    userProfile(id) {
        console.log("userProfile route");
        var profileview = new profileView(id);
        profileview.render();
    }

};

export default Workspace;
