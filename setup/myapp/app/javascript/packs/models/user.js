import Backbone from 'backbone'
import $ from 'jquery';
import Helper from '../Helper.js'

let User = Backbone.Model.extend({

    urlRoot: 'api/users',

    /* parse: function(data) {
        return new User(data);
    }, */
    initialize: function(){
        console.log("Fetching user [" + this.get("nickname") + "]");
    },
});

let UserCollection = Backbone.Collection.extend(
    {
        url: 'api/users',
        model: User,
        parse: function(data) {
            /* data.forEach(user => {
                this.add(user);
            }); */
            return data;
        },
        initialize: function(){
            Helper.fetch(this);
            this.on("change", function(){console.log("User added. Current size: "+ this.length)});
        }
    }
)

$(document).ready(
    function() {
        let col = new UserCollection();
    }
);


/* Helper.fetch(col); */
/* let usuario = new User({"nickname":"probando"});
col.add(usuario); */

export default UserCollection;