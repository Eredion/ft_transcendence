// App.js

Backbone._sync = Backbone.sync;
// override original sync method to 
Backbone.sync = function(method, model, options) {
    options || (options = {});
        if (!options.crossDomain) {
            options.crossDomain = true;
        }
    return Backbone._sync(method, model, options);
};

var Posts = Backbone.Collection.extend({
    url: 'http://rails:3000/posts', // Rails server returns json
    origin: true,
    initialize: function(){
        console.log("posts initialize");
    },
    parse : function(response, options){ // fetch call this function when receive data from server
        console.log("Parse call");
        jsonparse = JSON.stringify(response);
        document.write(jsonparse);
    }
});
