import Backbone from 'backbone'
//import homeView from './views/homeView'
//import newUserView from './views/newUserView'

// Routes
class Workspace extends Backbone.Router{

    get routes() {
        return {
            "": "home",
            "signup": "newUser"
        }    
    }

    home() {
        //var homeview = new homeView();
        //homeview.render();
    }

    newUser() {
        //var newUserview = new newUserView(); // Call list view
        //newUserview.render();
    }

};

export default Workspace;
