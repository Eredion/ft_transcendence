import _ from 'underscore'
import $ from 'jquery';
import consumer from '../../channels/consumer'
import Backbone from 'backbone'
import Helper from '../Helper';
import usercollection from '../models/user'
import trnmntcol from '../models/tournament'
import tournamentChannel from '../../channels/tournament_channel'
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
        this.cable = tournamentChannel.connect(Helper.userId(), this.receive_data, this);
        let template = _.template($("#playview-template").html());
        let output = template({});
        $('#content').html(output);
        this.render_tournament();
    },

    async render_tournament(){
        self = this;
        await Helper.fetch(trnmntcol).then(function(){
            console.log(trnmntcol.length)
            let tour = trnmntcol.at(trnmntcol.length - 1)
            if (tour != undefined)
            {
                if (tour.get("status") === 'open' && tour.get("users").includes(Helper.userId()) === false)
                {
                    let template = _.template($('#join-tour-template').html())
                    let output = template({'tournament':tour.toJSON()});
                    $('#join-tournament-wrapper').html(output)
                    $('#join-tournament-button').click(function(){
                        self.cable.perform("join_user", {'id':$(this).data("id"), 'userid': Helper.userId() })
                        $(this).hide();
                        if (tour.get('users').length + 1 === tour.get('size'))
                            $('#join-tournament-wrapper').hide();
                    })
                }
                let template2 = _.template($('#tournament-graph-template').html())
                let output2 = template2({'tournament':tour.toJSON()});
                $('#tournament-graph').html(output2)
            }
            else
            {
                let template = _.template($('#no-tournament-template').html())
                $('#tournament-view').html(template())
            }
            
        });
    },

    receive_data(data)
    {
        console.log(data);
        if (data.action === 'join_user')
        {
            console.log("Se une menganito")
            this.render();
        }
        
    },

    disconnect(){
        if (this.cable) {
            consumer.subscriptions.remove(this.cable);
            this.cable = null;
        }
    }
});

let playview = new playView();

export default playview;