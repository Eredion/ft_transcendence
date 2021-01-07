import Backbone from 'backbone'
import loginView from './views/loginView'
import registerView from './views/registerView'
import profileView from './views/profileView'
import pongView from './views/pongView'
import chatView from './views/chatView'
import userList from './views/userListView'
import Helper from './Helper'

// Routes
class Workspace extends Backbone.Router {

    execute(callback, args, name) {
        if (!Helper.logged() && (name != 'userSignin' && name != 'userSignup')) {
            console.log("user not logged, redirecting to sign_in view")
            this.navigate('sign_in', { trigger: true })
            return false
        }
        if (callback)
            callback.apply(this, args);
    }

    get routes() {
        return {
            "": "pong",
            "chat":"chat",
            "sign_in": "userSignin",
            "sign_up": "userSignup",
            "users/:id": "userProfile"
        }
    }

    pong() {
        console.log("pong route")
        var pongview = new pongView()
    }

    chat() {
        console.log("chat route")
        var chatview = new chatView()
        chatview.render()
        var online_users = new userList();
        online_users.render();
    }

    userSignin() {
        console.log("userSignin route")
        var signinView = new loginView()
        signinView.render()
    }

    userSignup() {
        console.log("userSignup route")
        var signupView = new registerView()
        signupView.render()
    }

    userProfile(id) {
        console.log("userProfile route")
        var profileview = new profileView(id)
        //profileview.render()
    }

};

export default Workspace;
