import Backbone from 'backbone'
import loginView from './views/loginView'
import registerView from './views/registerView'
import profileView from './views/profileView'
import pongView from './views/pongView'
import chatView from './views/chatView'
import conversView from './views/conversationView'
import channelsView from './views/channelsView'
import userList from './views/userListView'
import Helper from './Helper'

// Routes
class Workspace extends Backbone.Router {

    execute(callback, args, name) {
        this.undelegateViews()
            // If user is not logged in, redirect to login page (except sign in and signup views)
        if (!Helper.logged() && (name != 'userSignin' && name != 'userSignup')) {
            this.navigate('sign_in', { trigger: true })
            return false
        }
        // if user is logged in, redirect to main page (when the sign in and signup views is accessed)
        if (Helper.logged() && (name == 'userSignin' || name == 'userSignup')) {
            this.navigate('', { trigger: true })
            return false
        }
        if (callback)
            callback.apply(this, args);
    }

    // function than removes the last active view for fix zombie views error
    undelegateViews() {
        if (this.pongview) {
            this.pongview.undelegateEvents()
        }
        if (this.chatview) {
            this.chatview.undelegateEvents()
        }
        if (this.signinView) {
            this.signinView.undelegateEvents()
        }
        if (this.signupView) {
            this.signupView.undelegateEvents()
        }
        if (this.profileview) {
            this.profileview.undelegateChildViews()
            this.profileview.undelegateEvents()
        }
        if (this.playroomview) {
            this.playroomview.undelegateEvents()
        }
    }

    get routes() {
        return {
            "": "pong",
            "chat": "chat",
            "sign_in": "userSignin",
            "sign_up": "userSignup",
            "users/:id": "userProfile",
            "channels/": "channels",
            "channels/:name": "channels",
        }
    }
   

    pong() {
        console.log("pong route");
        this.pongview = new pongView();
        //pongview.render();
    }

    chat() {
        console.log("chat route")

        this.chatview = new chatView();
        this.chatview.render();
        //var online_users = new userList()
        //let conversview = new conversView();
        //conversview.setName("1-2");
        //conversview.on("change:chatName", conversview.render());
        //conversview.setName("1-3");
        //conversview.setName("default");
    }


    channel(){
        console.log("channel route");
        if (!this.channelView)
            this.channelView = new channelsView();
        this.channelView.render();
    }
    
    channels(name){
        console.log("channel route")
        console.log(name);
        if (!this.channelView)
            this.channelView = new channelsView();
        
        if (name != "default")
            this.channelView.render_channel(name);
        else
            this.channelView.render();
        
    }


 


    userSignin() {
        console.log("userSignin route")
        this.signinView = new loginView()
        this.signinView.render()
    }

    userSignup() {
        console.log("userSignup route.")
        this.signupView = new registerView()
        this.signupView.render()
    }

    userProfile(id) {
        console.log("userProfile route")
        this.profileview = new profileView(id)
            //profileview.render(id)
    }

};

export default Workspace;