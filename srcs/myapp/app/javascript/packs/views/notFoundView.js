import $ from 'jquery'
import _ from 'underscore'
import Backbone from 'backbone'

const Errors = {}

$(function () {

    Errors.error404 = Backbone.View.extend({

        el: "#content",

        template: _.template($('#error-404-template').html()),

        initialize() {
        },

        render() {
            this.$el.html(this.template());
            return this;
        }
    })

    Errors.NotFound = new Errors.error404()
});

export default Errors;
