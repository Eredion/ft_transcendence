import _ from 'underscore'
import $ from 'jquery';
import Backbone from 'backbone'
import Helper from '../Helper';
import userscollection from '../models/user'

let rulesetView = Backbone.View.extend({
    el: '#content',
    col: userscollection,
    initialize(){
    },
    render(){
        let template = _.template($('#ruleset-template').html())
        let output = template({});
        //$('#ruleset-wrapper').html(output)
    },
});

let ruleset = new rulesetView()
export default ruleset