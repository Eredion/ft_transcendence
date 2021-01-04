import _ from 'underscore'
import Backbone from 'backbone'

class registerView extends Backbone.View {

    initialize() {
        console.log("registerView initialize");
        this.template = $('script[name="userRegistration"]').html(); // views/users/_registrations.html.erb name script
    }

    render() {
        $("#content").html(_.template(this.template));
		return this;
    }
};

export default registerView;