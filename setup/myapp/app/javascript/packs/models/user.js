import Backbone from 'backbone'
import $ from 'jquery';
import Helper from '../Helper.js'

let User = Backbone.Model.extend({

    urlRoot: 'api/users',

    /* parse: function(data) {
        return new User(data);
    }, */
    initialize: function(){
        console.log("Initializing model: " + this.get("nickname"));
    },
});

let UserColl = Backbone.Collection.extend(
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
            this.on("add", function(){console.log("User added. Current size: "+ this.length)});
        }
    }
)

let col = new UserColl();

/* Helper.fetch(col); */
/* let usuario = new User({"nickname":"probando"});
col.add(usuario); */

export default User;