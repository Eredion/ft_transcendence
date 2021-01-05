import Backbone from 'backbone'
import loginView from './views/loginView'
import registerView from './views/registerView'
import chatView from './views/chatView'
import userList from './views/userListView'
class Workspace extends Backbone.Router {

    get routes() {
        return {
            "": "pong",
            "chat":"chat",
            "sign_in": "userSignin",
            "sign_up": "userSignup",
        }
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


};

export default Workspace;