import _ from 'underscore'
import $ from 'jquery';
import Backbone from 'backbone'
import Helper from '../Helper';
import userscollection from '../models/user'

let adminView = Backbone.View.extend({
    el: '#content',
    col: userscollection,
    admin: false,
    initialize(){
        self = this;
        Helper.fetch(this.col).then(function(){
            if (self.col.findWhere({'nickname':Helper.current_user()}).get("admin") === true)
                self.admin = true;
        });
    },

    sortByKey(array, key) {
        return array.sort(function(a, b) {
            var x = a[key]; var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    },

    async render(){
        self = this;
        if (this.admin === false)
            return;
        await Helper.fetch(this.col);
        let template = _.template($("#admin-template").html());
        let usersSorted = self.sortByKey(userscollection.toJSON(), "id");
        let output = template({'users':usersSorted});
        $('#content').html(output);

        $('.ban-user-button').click(async function(){
            let id = $(this).data().user;
            let nick = $(this).data().nickname;
            let formData = { nickname: nick, banned: true }
            let responses = await Helper.ajax("PUT", "api/users/"+ id, formData);
            self.render();
        }); 
        $('.unban-user-button').click(async function(){
            let id = $(this).data().user;
            let nick = $(this).data().nickname;
            let formData = { nickname: nick, banned: false }
            let responses = await Helper.ajax("PUT", "api/users/"+ id, formData);
            self.render();
        });

    },
});


export default adminView;