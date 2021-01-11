import _ from 'underscore'
import Backbone from 'backbone'
import Helper from '../Helper'

class registerView extends Backbone.View {

    get el() {
        return $("#content")
    }

    get events() {
        return {
            "submit #register-form": "submitForm"
        }
    }

    initialize() {
        console.log("registerView initialize");
        this.template = $('script[name="userRegistration"]').html(); // views/users/_registrations.html.erb name script
    }

    render() {
        $("#content").html(_.template(this.template));
        var forms = document.getElementsByClassName('needs-validation');
        var validation = Array.prototype.filter.call(forms, function(form) {

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
    }

    async submitForm(e) {
        e.preventDefault()
        e.stopPropagation()
        var form = $('#register-form')
        var formData = $(form).serialize()
        var response = await Helper.ajax('POST', 'sign_up', formData)
        if (response.status == 'ok') {
            window.location = response.location
        } else {
            alert('Some error ocurred. Try again')
            document.getElementById("register-form").reset()
            document.getElementById("register-form").classList.remove('was-validated')
        }
    }
};

export default registerView;