import _ from 'underscore'
import $ from 'jquery';
import Backbone from 'backbone'
import Helper from '../Helper';
import usercollection from '../models/user'

let playView = Backbone.View.extend({
    el: '#content',
    initialize(){
        self = this;
        console.log("initializing playview")
    },

    render(){
        self = this;
        let template = _.template($("#playview-template").html());
        let output = template({});
        $('#content').html(output);
    },
});

let playview = new playView();

export default playview;