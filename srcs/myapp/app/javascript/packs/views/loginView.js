import $ from 'jquery'
import _ from 'underscore'
import Backbone from 'backbone'
import Helper from '../Helper'

const Login = {}

if (!Helper.logged()) {

$(function () {

    Login.loginView = Backbone.View.extend({

        el: "#content",

        template: _.template($('#user_login_template').html()),

        events: {
            "submit #login-form": "submitForm"
        },

        initialize() {
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
                }, false);
            });
            return this;
        },

        async submitForm(e) {
            e.preventDefault()
            e.stopPropagation()
            var formData = $('#login-form').serialize()
            var response = await Helper.ajax('POST', 'sign_in', formData)
            if (response.status == 'ok') {
                window.location = response.location
            } else {
                document.getElementById("login-form").reset()
                document.getElementById("login-form").classList.remove('was-validated')
            }
        }
    })

    Login.view = new Login.loginView();

});
}

export default Login;
