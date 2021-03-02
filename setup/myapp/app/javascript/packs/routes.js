import Backbone from 'backbone'
import Login from './views/loginView'
import Register from './views/registerView'
import Profile from './views/profileView'
import Home from './views/homeView'
import chatView from './views/chatView'
import SearchMatch from './views/searchMatchView'
import channelsView from './views/channelsView'
import Match from './views/matchView'
import Helper from './Helper'
import PopupProfileView from './views/popupProfileView'
import Guilds from './views/guildsView'
import Errors from './views/notFoundView'
import rankingView from './views/rankingView'
import tournamentView from './views/tournamentView'
import adminview from './views/adminView'
import playview from './views/playView'
import adminView from './views/adminView'
import WarformView from './views/warformview'
import MySession from './models/session'
import TwoFa from './views/validate2faView'


class Workspace extends Backbone.Router {

    execute(callback, args, name) {
        this.undelegateViews()

        if (Helper.logged() && !Helper.valid() && name != 'validateTwoFA') {
            this.navigate('validate_two_fa', { trigger: true, replace: true })
            return false
        } else if (Helper.login.get_first_login()) { // Catch first login of the user and redirect to the user profile
            Helper.login.set_first_login(false)
            window.location.reload()
            return false
        } else if (!Helper.logged() && (name != 'userSignin' && name != 'userSignup')) { // If user is not logged in, redirect to login page (except sign in and signup views)
            this.navigate('sign_in', { trigger: true })
            return false
        } else if (Helper.logged() && Helper.valid() && (name == 'userSignin' || name == 'userSignup' || name == 'validateTwoFA')) { // if user is logged in, redirect to main page (when the sign in and signup views is accessed)
            this.navigate('', { trigger: true })
            return false
        }
        if (callback)
            callback.apply(this, args);
    }

    // function than removes the last active view for fix zombie views error
    undelegateViews() {
        if (this.homeview) {
            this.homeview.undelegateEvents()
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
        if (this.searchmatchView) {
            this.searchmatchView.removeChannel()
            this.searchmatchView.undelegateEvents()
        }
        if (this.matchView) {
            this.matchView.removeChannel()
            this.matchView.undelegateEvents()
        }
        if (this.guildsView) {
            this.guildsView.removeChannel()
            this.guildsView.undelegateEvents()
        }
        if (this.guildView) {
            this.guildView.removeChannel()
            this.guildView.undelegateEvents()
        }
        if (this.playview) {
            this.playview.disconnect()
            this.playview.undelegateEvents()
        }
    }

    get routes() {
        return {
            "": "myProfile",
            "chat": "chat",
            "sign_in": "userSignin",
            "sign_up": "userSignup",
            "validate_two_fa": "validateTwoFA",
            "play": 'play',
            "users/:id": "userProfile",
            "channels": "channels",
            "popup1": "popup_profile",
            "popup1/:name": "popup_profile",
            "search_match/:id": "search_match",
            "match/:id": "match",
            "guilds": "guilds",
            "guilds/:id": "guild",
            "ranking": "ranking",
            "admin": "admin",
            "challenge/:id": "search_match",
            "challenge/:id/accept/:from": "search_match",
            "war/new": "warform",
            "*actions": "notFound",
            "tournament/:id": "tournament",
        }
    }

    tournament(id)
    {
        this.tournamentview = new tournamentView(id);
        this.tournamentview.render(id);
    }

    validateTwoFA() {
        console.log("validate2fa route")
        this.two_fa = new TwoFa.view()
        this.two_fa.render()
    }

    admin() {
        if (Helper.current_user() === 'theadmin') {
            if (!this.adminview)
                this.adminview = new adminView();
            this.adminview.render();
        } else
            this.notFound();
    }

    popup_profile() {
        this.popupprofile = new PopupProfileView(($('.popup-user-title').text()));
    }

    warform() {
        this.warformview = new WarformView();
        this.warformview.render();
    }

    chat() {
        if (!this.chatview)
            this.chatview = new chatView();
        this.chatview.render();
    }

    ranking() {
        if (!this.rankView)
            this.rankView = new rankingView();
        this.rankView.render();
    }

    channels() {
        console.log();
        if (!this.channelView)
            this.channelView = new channelsView();
        this.channelView.render();
       //if (name != "default")
        //    this.channelView.check_password(name);
        


    }

    userSignin() {
        console.log("userSignin route")
        this.signinView = Login.view
        this.signinView.delegateEvents()
        this.signinView.render()
    }

    userSignup() {
        console.log("userSignup route.")
        this.signupView = Register.view
        this.signupView.delegateEvents()
        this.signupView.render()
    }

    myProfile() {
        this.profileview = new Profile.view(Helper.userId());
    }

    userProfile(id) {
        console.log("userProfile route")
        this.profileview = new Profile.view(id);
    }

    play() {
        this.playview = playview;
        this.playview.render();
    }

    search_match(id, from) { // Id is also used for type of match
        console.log('search_match route')
        if (id && id.length > 0 && from && from.length > 0)
            this.searchmatchView = new SearchMatch.view(id, from)
        else if (id && id.length > 0)
            this.searchmatchView = new SearchMatch.view(id)
        else
            this.searchmatchView = new SearchMatch.view()
    }

    match(id) {
        console.log('match route')
        this.matchView = new Match.view(id)
    }

    guilds() {
        console.log('guilds route')
        this.guildsView = Guilds.view
        this.guildsView.delegateEvents()
        this.guildsView.render()
    }

    guild(id) {
        console.log('guild ' + id + ' route')
        this.guildView = new Guilds.GuildView(id)
    }

    notFound() {
        console.log('error 404 Not Found')
        this.error404 = Errors.NotFound
        this.error404.render()
    }

};

export default Workspace;