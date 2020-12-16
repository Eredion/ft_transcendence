import _ from 'underscore'
import Backbone from 'backbone'


class profileView extends Backbone.View {

    initialize(user_id) {
        console.log("profile View initialize");
        this.userId = user_id;
        this.template = $('script[name="userProfile"]').html(); // views/pong/_profile.html.erb
        $.ajax({
			url: "users/"+this.userId,
			type: "GET",
            dataType: "json",
            error(e) {
                console.log("Some error happened " + e)
            },
            success(data) {
                console.log("Ok")
                console.log(data)
                $("#user-nickname").text(data.nickname)
            }
		})
    }

    render() {
        $("#content").html(_.template(this.template));
		return this;
    }
};

export default profileView;
