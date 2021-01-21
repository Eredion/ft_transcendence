import Backbone from 'backbone'
import $ from 'jquery'
import _ from 'underscore'

let channelsView = Backbone.View.extend({

    el: '#channels',

    initialize() {
        this.$el.html($('#channels-template').html());
    },

    render() {
        console.log("RENDER");
        
    },
});

export default channelsView;