import _ from 'underscore'
import $ from 'jquery';
import Backbone from 'backbone'
import Helper from '../Helper';
import usercollection from '../models/user'

let adminView = Backbone.View.extend({
    el: '#content',
    col: usercollection,

    initialize(){
        Helper.fetch(this.col).then(function(){
            if (this.col.findWhere({'name':Helper.current_user()}) != undefined)
            {
                
            }
        });
    },

    render(){

    },
});

let adminview = new adminView();

export default adminview;