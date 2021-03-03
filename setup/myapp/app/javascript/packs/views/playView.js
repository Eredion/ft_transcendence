import _ from 'underscore'
import $ from 'jquery';
import consumer from '../../channels/consumer'
import Backbone from 'backbone'
import Helper from '../Helper';
import usercollection from '../models/user'
import trnmntcol from '../models/tournament'
import tournamentChannel from '../../channels/tournament_channel'
import GuildCollection from '../models/guilds';
let playView = Backbone.View.extend({
    el: '#content',
    guildCol: new GuildCollection(),
    wartime: false,
    events: {
        'click #show-tournament-button': 'render_tournament',
    },
    initialize(){

    },
   
    async render(){
        let myself = await Helper.ajax('GET', 'api/users/' + Helper.userId());
        this.myself = myself;
        self = this;
        this.cable = tournamentChannel.connect(Helper.userId(), this.receive_data, this);
        let template = _.template($("#playview-template").html());
        let guild = await Helper.ajax('GET', 'api/guilds/' + myself.guild_id);
        console.log(guild);
        if (myself.guild_id && ((guild.success).includes(`"inwar":true`) === true))
            this.wartime = true;
        let output = template({'user': this.myself, 'inwar': this.wartime});
        $('#content').html(output);
        this.render_tournament();
    },

    async render_tournament(){
        self = this;
        this.current_user = Helper.userId()
        await Helper.fetch(trnmntcol).then(function(){
            let tour = trnmntcol.findWhere({'status':'open'})
            if (tour === undefined)
                tour = trnmntcol.findWhere({'status':'active'})
            console.log(tour)
            if (tour != undefined)
            {

                if (tour.get("status") === 'open' && self.myself.intournament === false)
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
                else if (tour.get("status") === 'open' && self.myself.intournament === true)
                {
                    //console.log("case 1.5")
                    $('#tournament-play-button').hide()
                    let template = _.template($('#join-tour-template').html())
                    let output = template({'tournament':tour.toJSON()});
                    $('#join-tournament-wrapper').html(output)
                    $('#join-tournament-button').hide();
                }
                else if (tour.get("status") === "active" && self.myself.intournament === true)
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
                    if (tour.get("status") === "active" && self.myself.intournament === false)
                    {
                        let template2 = _.template($('#no-tournament-template').html())
                        $('#tournament-view').html(template2())
                        $('.tournament-empty-banner').text("There is a tournament ongoing, please wait for the next one.")
                    }
                    $('#tournament-play-button').hide();
                }
            }
            else
            {
                $('#tournament-play-button').hide()
                let template = _.template($('#no-tournament-template').html())
                $('#tournament-view').html(template())

            }

            let rules = _.template($('#ruleset-template').html())
            let output = rules({});
            $('#ruleset-wrapper').html(output)
            
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