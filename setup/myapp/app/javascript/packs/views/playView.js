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
        //console.log("initializing playview")
    },

    render(){
        self = this;
        this.cable = tournamentChannel.connect(Helper.userId(), this.receive_data, this);
        let template = _.template($("#playview-template").html());
        let output = template({});
        $('#content').html(output);
        this.render_tournament();
    },

    /* async */ render_tournament(){
        self = this;
        this.current_user = Helper.userId()
        Promise.all([Helper.fetch(trnmntcol), Helper.fetch(usercollection)]).then(function(){
        //await Helper.fetch(trnmntcol).then(function(){
            let myself = (usercollection.findWhere({id : self.current_user})).toJSON();
            //console.log(trnmntcol.length)
            let tour = trnmntcol.at(trnmntcol.length - 1)
            if (tour != undefined)
            {

                if (tour.get("status") === 'open' && myself.intournament === false)
                {
                    //console.log("case 1")
                    $('#tournament-play-button').hide()
                    let template = _.template($('#join-tour-template').html())
                    let output = template({'tournament':tour.toJSON()});
                    $('#join-tournament-wrapper').html(output)
                    $('#join-tournament-button').click(function(){
                        self.cable.perform("join_user", {'id':$(this).data("id"), 'userid': Helper.userId() })
                        $(this).hide();
                        
                    })
                }
                else if (tour.get("status") === 'open' && myself.intournament === true)
                {
                    //console.log("case 1.5")
                    $('#tournament-play-button').hide()
                    let template = _.template($('#join-tour-template').html())
                    let output = template({'tournament':tour.toJSON()});
                    $('#join-tournament-wrapper').html(output)
                    $('#join-tournament-button').hide();
                }
                else if (tour.get("status") === "active" && myself.intournament === true)
                {
                    //console.log("case 2")
                    $('#tournament-play-button').show();
                }
                else if (tour.get("status") === "finished")
                {
                    //console.log("case 3")
                    let template = _.template($('#no-tournament-template').html())
                    $('#tournament-view').html(template())
                    $('.tournament-empty-banner').text("The current tournament has finished")
                    $('#tournament-play-button').hide();
                }
                else
                {
                    //console.log("case 4")
                    if (tour.get("status") === "active" && myself.intournament === false)
                    {
                        let template2 = _.template($('#no-tournament-template').html())
                        $('#tournament-view').html(template2())
                        $('.tournament-empty-banner').text("There is a tournament ongoing, please wait for the next one.")
                    }
                    $('#tournament-play-button').hide();
                }
                //tournament bracket
                let users = tour.get("users")
                let uindex = -1;
                for (let i = 0; i < users.length; i++)
                {
                    if (users[i].id === Helper.userId())
                        uindex = i;
                }
                //console.log(uindex)

                //let template2 = _.template($('#tournament-graph-template').html()) 
                //let output2 = template2({'tournament':tour.toJSON(),'userid': Helper.userId()});
                //$('#tournament-graph').html(output2)
            }
            else
            {
                $('#tournament-play-button').hide()
                let template = _.template($('#no-tournament-template').html())
                $('#tournament-view').html(template())

            }
            
        });
    },

    receive_data(data)
    {
        self = this;
        //console.log(data);
        if (data.action === 'join_user')
        {
            setTimeout(function(){ self.render() }, 500);
        }
        else if (data.action === "tournament_is_active" || data.action === 'tournament_is_finished')
        {
            self.render();
            
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