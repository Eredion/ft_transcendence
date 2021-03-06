# frozen_string_literal: true

class Users::SessionsController < Devise::SessionsController
  before_action :configure_sign_in_params, only: [:create]

  # POST /resource/sign_in
  def create
    user = User.new configure_sign_in_params
    ufind = User.find_by(nickname: user.nickname)
    if ufind && ufind.valid_password?(user.password)
      if ufind.banned == true
        flash[:alert] = "You have been banned."
      else
        if ufind.status != 0
          ufind.send_notification('close_session')
        end
        if ufind.otp_required_for_login == true
          ufind.otp_validated = false
          ufind.save
        end
        sign_in(ufind)
      end
      respond_to do |format|
        format.json { render json: { location: root_path, status: 'ok' } }
      end
    else
      flash[:alert] = "Nickname or password are incorrect"
      respond_to do |format|
        format.json { render json: { location: root_path, status: 'ok' } }
      end
    end
  end

  # DELETE /resource/sign_out
  def destroy
    super
  end

  protected

  def configure_sign_in_params
    params.permit(:nickname, :password)
  end
  # If you have extra params to permit, append them to the sanitizer.
  #def configure_sign_in_params
  #  devise_parameter_sanitizer.permit(:sign_in, keys: [:nickname, :password])
  #end
end
