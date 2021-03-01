import $ from 'jquery'
import _ from 'underscore'
import Backbone from 'backbone'
import Helper from '../Helper'
import MySession from '../models/session'

const TwoFa = {}

if (Helper.logged() && !Helper.valid()) {

$(function () {

    TwoFa.view = Backbone.View.extend({

        el: "#content",

        template: _.template($('#two-fa-validate-template').html()),

        events: {
            "submit #twofa-form": "validateCode"
        },

        initialize() {
            console.log("TwoFaView initialize");
        },

        render() {
            console.log("TwoFaView RENDER");
            this.$el.html(this.template());
            return this;
        },

        async validateCode(e) {
            e.preventDefault()
            var codeData = $('#twofa-form').serialize()
            var response = await Helper.ajax('POST', 'api/users/' + Helper.userId() + '/validate_two_fa', codeData)
            if (response['error']) {
                Helper.custom_alert('danger', response['error'])
                document.getElementById("twofa-form").reset()
            } else {
                Helper.custom_alert('success', response['success'])
                window.location = response.location
            }
        }
    })
});

};

export default TwoFa;
