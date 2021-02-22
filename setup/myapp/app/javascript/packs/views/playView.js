import _ from 'underscore'
import $ from 'jquery';
import Backbone from 'backbone'
import Helper from '../Helper';
import usercollection from '../models/user'
import trnmntcol from '../models/tournament'

let playView = Backbone.View.extend({
    el: '#content',
    events: {
        'click #show-tournament-button': 'render_tournament',
    },
    initialize(){
        self = this;
        console.log("initializing playview")
    },

    render(){
        self = this;
        let template = _.template($("#playview-template").html());
        let output = template({});
        $('#content').html(output);
        self.render_tournament();
    },

    async render_tournament(){
        self = this;
        await Helper.fetch(trnmntcol).then(function(){
            let tour = trnmntcol.at(trnmntcol.length)
            if (tour !=  undefined)
            {
                if (tour.get("status") === 'open')
                {
                    console.log("render button de join")
                }
                
                // render cosas
            }
            else
            {
                let template = _.template($('#no-tournament-template').html())
                let output = template();
                $('#tournament-view').html(template())
            }
            
        });
    },
});

let playview = new playView();

export default playview;