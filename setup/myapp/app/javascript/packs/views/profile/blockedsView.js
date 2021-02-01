import _ from 'underscore'
import $ from 'jquery'
import Backbone from 'backbone'
import Helper from '../../Helper'

const Blockeds = {}

$(function () {

    Blockeds.UsersModel = Backbone.Model.extend({

        parse (response) {
            return { data: JSON.parse(response.success) }
        },
    
        initialize(options) {
            this.uid = options.user_id
            this.urlRoot = 'api/users/' + this.uid + '/show_blockeds'
        }
    });

    Blockeds.view = Backbone.View.extend({

        el: "#blocked-users-data",
    
        template: _.template($('#blocked_users_template').html()),

        events: {
            "click .unblock-btn": "unblockUser"
        },
    
        initialize(id) {
            this.user_id = id
            this.model = new Blockeds.UsersModel({ user_id: this.user_id })
        },
    
        async update() {
            await Helper.fetch(this.model)
            this.render()
        },
    
        render() {
            this.$el.html(this.template({ 'blocked_users': this.model.toJSON() }))
            return this
        },

        async unblockUser(e) {
            e.preventDefault()
            var formData = { user_id: $(e.currentTarget).data().userblockId }
            var response = await Helper.ajax('DELETE', 'users/' + Helper.userId() + '/unblock_user', formData)
            if (response['error']) {
                Helper.custom_alert('danger', response['error'])
            } else {
                this.update()
                Helper.custom_alert('success', response['success'])
            }
        }
    
    });
})

export default Blockeds;
