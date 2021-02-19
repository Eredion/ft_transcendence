import _ from 'underscore'
import $ from 'jquery';
import Backbone from 'backbone'
import Helper from '../Helper';
import userscollection from '../models/user'
import Matchmaking from '../../channels/matchmaking_channel'

let waitView = Backbone.View.extend({
    el: '#content',

    initialize(id){
        this.id = id;
        self = this;
        console.log("initializing waitview " + id)
    },

    receive_data(data) {
        console.log(data.action)
    },

    async render(){
        self = this;
        Matchmaking.channel.connect(Helper.userId(), this.receive_data, this, "wait_peer", self.id)

        await Helper.fetch(userscollection).then(function(){
            let template = _.template($("#wait_template").html());
            console.log(self.id);
            console.log(userscollection);
            let model = userscollection.findWhere({id: parseInt(self.id)})
            console.log(model)
            let output = template({user: model.toJSON()});
            $('#content').html(output);

        })
        
    },
});


export default waitView;