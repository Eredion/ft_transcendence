import Backbone from 'backbone'
import Login from './views/loginView'
import Register from './views/registerView'
import Profile from './views/profileView'
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
import playview from './views/playView'
import adminView from './views/adminView'
import WarformView from './views/warformview'
import TwoFa from './views/validate2faView'
import ruleset from './views/ruleset'
import Home from './views/homeView'

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
            this.homeview.removeChannel()
            this.homeview.undelegateEvents()
        }
        if (this.chatview) {
            this.chatview.undelegateEvents()
        }
        if (this.channelView) {
            this.channelView.undelegateEvents()
            this.channelView.disconnect()
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
            "": "home",
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
            "tournament/:id": "tournament",
            "admin": "admin",
            "challenge/:id": "search_match",
            "challenge/:id/accept/:from": "search_match",
            "war/new": "warform",
            "*actions": "notFound",
        }
    }

    tournament(id)
    {
        this.tournamentview = new tournamentView(id);
    }

    validateTwoFA() {
        this.two_fa = new TwoFa.view()
        this.two_fa.render()
    }

    async admin() {
        let formData = { id: Helper.userId() }
        let user = await Helper.ajax("GET", "api/users/"+ Helper.userId(), formData);
        if (user.admin === true) {
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
        this.channelView = new channelsView();
        this.channelView.render();
    }

    userSignin() {
        this.signinView = Login.view
        this.signinView.delegateEvents()
        this.signinView.render()
    }

    userSignup() {
        this.signupView = Register.view
        this.signupView.delegateEvents()
        this.signupView.render()
    }

    home() {
        this.homeview = new Home.view()
    }

    userProfile(id) {
        this.profileview = new Profile.view(id);
    }

    play() {
        this.playview = playview;
        this.playview.render();
        this.ruleset = ruleset;
        this.ruleset.render();
    }

    search_match(id, from) { // Id is also used for type of match
        if (id && id.length > 0 && from && from.length > 0)
            this.searchmatchView = new SearchMatch.view(id, from)
        else if (id && id.length > 0)
            this.searchmatchView = new SearchMatch.view(id)
        else
            this.searchmatchView = new SearchMatch.view()
    }

    match(id) {
        this.matchView = new Match.view(id)
    }

    guilds() {
        this.guildsView = Guilds.view
        this.guildsView.delegateEvents()
        this.guildsView.render()
    }

    guild(id) {
        this.guildView = new Guilds.GuildView(id)
    }

    notFound() {
        this.error404 = Errors.NotFound
        this.error404.render()
    }

};

export default Workspace;