import _ from 'underscore'
import Backbone from 'backbone'

class User extends Backbone.Model {

    get defaults() {
        return {
            user_id: 0,
            nickname: "none"
        }
    }

};

export default User;
