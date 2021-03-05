class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController

  skip_before_action :verify_authenticity_token, only: :marvin

  def marvin
    user, first_login = User.from_omniauth(request.env["omniauth.auth"])

    if user.persisted?
      if user.banned == true
        flash[:alert] = "You have been banned."
        return redirect_to root_path
      end
      if user.status != 0
        user.send_notification('close_session')
      end
      if user.otp_required_for_login == true
        user.otp_validated = false
        user.save
      end
      sign_in(user)
      if first_login == true
        redirect_to "/#users/#{user.id}"
      else
        redirect_to root_path
      end
    else
      session["devise.marvin_data"] = request.env["omniauth.auth"].except("extra") # Removing extra as it can overflow some session stores
      redirect_to root_path
    end
  end

  # GET|POST /resource/auth/marvin
  def passthru
    super
  end

  # GET|POST /users/auth/marvin/callback
  def failure
    redirect_to root_path
  end
end
