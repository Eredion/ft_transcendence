import Backbone from 'backbone'
import loginView from './views/loginView'
import registerView from './views/registerView'
import App from './application'

// Routes
class Workspace extends Backbone.Router {

    get routes() {
        return {
            "": "rootPath",
            "sign_in": "userSignin",
            "sign_up": "userSignup",
        }
    }

    rootPath() {
        console.log("rootPath route");
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

};

export default Workspace;
