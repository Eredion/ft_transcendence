// App.js

$.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
    options.url = 'http://127.0.0.1:3000' + options.url;
});

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
    url: '/posts', // Rails server returns json
    origin: true,
    initialize: function(){
        console.log("posts initialize");
    },
    parse : function(response, options){ // fetch call this function when receive data from server
        console.log("Parse call");
        var messageFromRails = response['data'];
        var messageFromPostgresql = response['postgresql'][0].title;
        alert(messageFromRails);
        alert(messageFromPostgresql);
    }
});
