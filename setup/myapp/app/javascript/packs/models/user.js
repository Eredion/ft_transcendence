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
        },

    }
)

$(document).ready(
    function() {
        
        /* Helper.fetch(col); */
        setTimeout(function(){
            
        }, 2000);
    }
);

let userscollection = new UserCollection();
userscollection.on("change", function(){console.log("User changed. Current size: "+ this.length)});

            let usuario = new User({"nickname":"probando"});
            userscollection.push(usuario);

export default userscollection;