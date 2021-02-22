import _ from 'underscore';
import $ from 'jquery';
import Backbone from 'backbone';
import Helper from '../Helper';
import notificationcollection from '../models/notifications'
import Friends from './friendsView'
import Matchmaking from '../../channels/matchmaking_channel'

const Notification = {}

if (Helper.logged()) {
//Se asegura que la pagina esté cargada completamente ya que da fallo
$(function () {

    Notification.notificationView = Backbone.View.extend({

        el: "#notifications-menu",

        collection: notificationcollection,
    
        template: _.template($('script[name="notification_template"]').html()),

        events: {
            "click .friend-request": "manageFriendRequest",
            "click .accept-challenge" : "acceptChallenge",
            "click .decline-challenge" : "declineChallenge",
        },
        
        async initialize() {
            console.log('notificationView initialize')
            this.listenTo(this.collection, "update", this.render);
            await Helper.fetch(this.collection)
            if (!_.size(this.collection)) {
                this.render()
            }
        },

        render() {
            console.log('notificationView render')
            this.$el.html(this.template({ 'notifications': this.collection.toJSON() }));
            return this
        },

        async manageFriendRequest(e) {
            console.log('manageFriendRequest event call!')
            e.preventDefault()
            var formData = {
                id: $(e.currentTarget).data().requestId,
                requestor_id: $(e.currentTarget).data().userfriendId,
                receiver_id:  Helper.userId(),
                status: $(e.currentTarget).data().action
            }
            var response = await Helper.ajax('PATCH', 'api/requests/' + formData.id, formData)
            if (response['error']) {
                Helper.custom_alert('danger', response['error'])
            } else {
                this.collection.remove(this.collection.where({ id: formData.id }))
                Helper.custom_alert('success', response['success'])
                Friends.view.update()
            }
        },

        acceptChallenge(e){
            console.log(e)
            console.log(e.currentTarget)
            console.log($(e.currentTarget).data().nickname)
            let id = $(e.currentTarget).data().id
            $('#' + id + ".challenge-dropdown").remove();
            $('#notification-count').text(parseInt($('#notification-count').text()) - 1)
            
        },

        declineChallenge(e){
            let id = $(e.currentTarget).data().id
            $('#' + id + ".challenge-dropdown").remove();
            $('#notification-count').text(parseInt($('#notification-count').text()) - 1)

            //$('.challenge-dropdown#'+id).remove()
        },

        addNotification(e) {
            console.log('addNotification event call!')
            this.collection.add([e])
        }
    });

    Notification.view = new Notification.notificationView();

});

};

export default Notification;
