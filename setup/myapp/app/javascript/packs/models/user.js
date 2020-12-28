import _ from 'underscore'
import Backbone from 'backbone'

class User extends Backbone.Model {

    get defaults() {
        return {
            user_id: 0,
            nickname: "none",
            avatar: "#"
        }
    }

    urlRoot = 'users/'

    idAttribute = 'user_id'

};

const user = new User;

export default user;
