import _ from 'underscore'
import Backbone from 'backbone'


class loginView extends Backbone.View {

    initialize() {
        console.log("Login View initialize");
        this.template = $('script[name="userLogin"]').html(); // views/users/sessions/new.html.erb name script
    }

    render() {
        $("#content").html(_.template(this.template));
		return this;
    }
};

export default loginView;