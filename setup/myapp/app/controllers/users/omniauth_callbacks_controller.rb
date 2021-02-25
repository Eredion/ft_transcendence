class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController

  skip_before_action :verify_authenticity_token, only: :marvin

  def marvin
    user = User.from_omniauth(request.env["omniauth.auth"])

    if user.persisted?
      if user.banned == true
        flash[:alert] = "You have been banned."
        return redirect_to root_path
      end
      if user.status != 0
        user.send_notification('close_session')
      end
      sign_in_and_redirect user, event: :authentication #this will throw if user is not activated
      #set_flash_message(:notice, :success, :kind => "42") if is_navigational_format?
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
