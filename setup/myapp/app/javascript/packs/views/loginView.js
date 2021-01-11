import _ from 'underscore'
import Backbone from 'backbone'
import Helper from '../Helper'

class loginView extends Backbone.View {

    get el() {
        return $("#content")
    }

    get events() {
        return {
            "submit #login-form": "submitForm"
        }
    }

    initialize() {
        console.log("Login View initialize");
        this.template = $('script[name="userLogin"]').html(); // views/users/sessions/new.html.erb name script
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
            }, false);
        });
		return this;
    }

    async submitForm(e) {
        e.preventDefault()
        e.stopPropagation()
        var form = $('#login-form')
        var formData = $(form).serialize()
        var response = await Helper.ajax('POST', 'sign_in', formData)
        if (response.status == 'ok') {
            window.location = response.location
        } else {
            alert('Nickname or password are incorrect. Try again')
            document.getElementById("login-form").reset()
            document.getElementById("login-form").classList.remove('was-validated')
        }
    }
};

export default loginView;