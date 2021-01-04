import Backbone from 'backbone'

let User = Backbone.Model.extend({
    urlRoot: "api/users/",
    url: function () {
        return this.urlRoot + encodeURIComponent(this.get('id'));
    },
    idAttribute: 'id',
    defaults: {"id":1,"email":"marvin@marvin.com","nickname":"marvin"},
    initialize: function () {
        this.fetch();
    },
});
export default User