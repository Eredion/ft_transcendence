import _ from 'underscore'
import Backbone from 'backbone'
import user from '../models/user'
import Helper from '../Helper'


class profileView extends Backbone.View {

    
    async initialize(user_id) {
        console.log("profile View initialize");
        //this.userId = user_id;
        this.model = user.set('user_id', user_id); // id of the user who is going to make the request to the server
        this.template = _.template($('script[name="userProfile"]').html()); // views/pong/_profile.html.erb
        /*$.ajax({
			url: "users/"+this.userId,
			type: "GET",
            dataType: "json",
            error(e) {
                console.log("Some error happened " + e)
            },
            success(data) {
                const dat = data
                console.log("Ok")
                console.log(data)
                //$("#user-nickname").text(data.nickname)
            }
        })*/
        await Helper.fetch(this.model);
        this.render();
    }

    render() {
        $("#content").html(this.template(this.model.toJSON()));
		return this;
    }
};

export default profileView;
