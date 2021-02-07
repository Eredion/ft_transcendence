import $ from 'jquery'
import _ from 'underscore'
import Backbone from 'backbone'
import Helper from '../Helper'

const Register = {}

if (!Helper.logged()) {

$(function () {

    Register.registerView = Backbone.View.extend({

        el: "#content",

        template: _.template($('#user_registration_template').html()),

        events: {
            "submit #register-form": "submitForm"
        },

        initialize() {
            console.log("registerView initialize");
        },

        render() {
            this.$el.html(this.template());
            var forms = document.getElementsByClassName('needs-validation');
            Array.prototype.filter.call(forms, function(form) {
    
                form.addEventListener('submit', function(event) {
    
                    if (form.checkValidity() === false) {
    
                        event.preventDefault();
                        event.stopPropagation();
                    }
                    form.classList.add('was-validated');
                    var passw = document.getElementById("password")
                    var rep_passw = document.getElementById("password-confirmation");
                    if (!passw.value.length || !rep_passw.value.length || passw.value !== rep_passw.value) {
    
                        event.preventDefault();
                        event.stopPropagation();
                        passw.setCustomValidity("Passwords Don't Match");
                        rep_passw.setCustomValidity("Passwords Don't Match");
                    } else {
    
                        passw.setCustomValidity("");
                        rep_passw.setCustomValidity("");
                    }
                }, false);
            });
            return this;
        },

        async submitForm(e) {
            e.preventDefault()
            e.stopPropagation()
            var formData = $('#register-form').serialize()
            var response = await Helper.ajax('POST', 'sign_up', formData)
            if (response.status == 'ok') {
                window.location = response.location
            } else {
                Helper.custom_alert('danger', 'Some error ocurred. Try again')
                document.getElementById("register-form").reset()
                document.getElementById("register-form").classList.remove('was-validated')
            }
        }
    })

    Register.view = new Register.registerView()
});

};

export default Register;
