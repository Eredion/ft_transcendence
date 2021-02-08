import Backbone from 'backbone'
import Login from './views/loginView'
import Register from './views/registerView'
import Profile from './views/profileView'
import pongView from './views/pongView'
import chatView from './views/chatView'
import SearchMatch from './views/searchMatchView'
import conversView from './views/conversationView'
import channelsView from './views/channelsView'
import Match from './views/matchView'
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
        if (this.channelView) {
            this.channelView.undelegateEvents()
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
<<<<<<< HEAD
        if (this.searchmatchView) {
            this.searchmatchView.removeChannel()
            this.searchmatchView.undelegateEvents()
=======
        if (this.playroomview) {
            this.playroomview.undelegateEvents()
>>>>>>> origin/main
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
            "search_match": "search_match",
            "match/:id": "match"
        }
    }
   

    pong() {
        console.log("pong route");
        this.pongview = new pongView();
        //pongview.render();
    }

    chat() {
        console.log("chat route")
        if (!this.chatview)
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
        this.signinView = Login.view
        this.signinView.render()
    }

    userSignup() {
        console.log("userSignup route.")
        this.signupView = Register.view
        this.signupView.render()
    }

    userProfile(id) {
        console.log("userProfile route")
        this.profileview = new Profile.view(id)
    }

    search_match() {
        console.log('search_match route')
        this.searchmatchView = new SearchMatch.view()
    }

    match(id) {
        console.log('match route')
        this.matchView = new Match.view(id)
    }

};

export default Workspace;