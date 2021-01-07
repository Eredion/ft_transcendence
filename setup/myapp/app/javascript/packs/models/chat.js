import Backbone from 'backbone'

let ChatModel = Backbone.Model.extend({
    urlRoot: 'api/chats',

    initialize: function() {
        console.log("Fetching chat " + this.get("name"));
    },

})

/* let ChatCollection = Backbone.Collection.extend(
    {
        url: 'api/chats',
        model: ChatModel,
        parse: function(data) {
            /* data.forEach(user => {
                this.add(user);
            }); 
            return data;
        },
        initialize: function(){
            Helper.fetch(this);
        },
    }
) */

let uuu = new ChatModel();

export default uuu;