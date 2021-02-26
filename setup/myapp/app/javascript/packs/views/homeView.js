import $ from 'jquery'
import _ from 'underscore'
import Backbone from 'backbone'
import Helper from '../Helper';

const Home = {}

$(function () {

if (Helper.logged() && Helper.valid()) {

    Home.view = Backbone.View.extend({
        el: "#content",

        template: _.template($('script[name="game"]').html()),

        initialize() {
            console.log("Home View initialize");
            this.render()
        },

        render() {
            this.$el.html(this.template());
		    return this;
        }
    })
}
})

export default Home;
