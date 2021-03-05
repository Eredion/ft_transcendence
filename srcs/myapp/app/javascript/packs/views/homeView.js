import $ from 'jquery'
import _ from 'underscore'
import Backbone from 'backbone'
import Helper from '../Helper'
import ActiveMatches from '../../channels/active_matches_channel'
import warcol from '../models/war'
import UserCol from '../models/user'

const Home = {}

$(function () {

if (Helper.logged() && Helper.valid()) {

    Home.MatchModel = Backbone.Model.extend({
        urlRoot: 'api/matches/in_progress'
    });

    Home.MatchCollection = Backbone.Collection.extend({
        url: 'api/matches/in_progress',
        model: Home.MatchModel
    });

    Home.view = Backbone.View.extend({
        el: "#content",

        Matches: new Home.MatchCollection(),

        template: _.template($('#home_template').html()),

        matches_template: _.template($('#active_matches_template').html()),

        initialize() {
            this.render()
            this.update_matches()
            ActiveMatches.channel.connect(this.manage_data, this)
        },

        manage_data(data) {
            if (data['action'] == 'update_matches') {
                this.update_matches()
            }
        },

        render() {
            this.$el.html(this.template());
            this.render_active_wars();
            this.render_users(); 
		    return this;
        },

        async render_users(){
            await Helper.fetch(UserCol).then(function(){
                let template = _.template($('#online_users_template').html())
                let output = template({'users': UserCol.toJSON()})
                $('#online-users-wrapper').html(output);
            });
        },

        async render_active_wars()
        {
            await Helper.fetch(warcol).then(function(){
                let template = _.template($('#active_wars_template').html())
                let output = template({'wars': warcol.toJSON()})
                $('#active-wars-wrapper').html(output);
            });
        },

        async update_matches() {
            await Helper.fetch(this.Matches);
            this.render_matches()
        },

        render_matches() {
            this.$el.find("#active-matches-data").html(this.matches_template({ 'matches': this.Matches.toJSON() }));
        },

        removeChannel() {
            ActiveMatches.channel.disconnect()
        }
    })
}
})

export default Home;
