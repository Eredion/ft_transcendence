import Backbone from 'backbone'
import $ from 'jquery';

let User = Backbone.Model.extend({

    urlRoot: 'api/users',

    parse: function(data) {
        return new User(data);
    },
    initialize: function(){
        console.log("Initializing model: " + this.get("nickname"));
    },
});


let UserColl = Backbone.Collection.extend(
    {
        url: 'api/users',
        model: User,
        parse: function(data) {
            data.forEach(user => {
                this.add(user);
                console.log(this.length);
            });
            return this;
        },
        initialize: function(){
            console.log("Collection size: "+ this.length);
        }
    }
)

let col = new UserColl();
col.fetch();

col.on("add", function(){console.log("NUEVO USUARIO!")});
export default User;