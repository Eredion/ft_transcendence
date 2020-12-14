# frozen_string_literal: true

class Users::SessionsController < Devise::SessionsController
  before_action :configure_sign_in_params, only: [:create]

  # POST /resource/sign_in
  def create
    @user = User.new configure_sign_in_params
    ufind = User.find_by(nickname: @user.nickname)
    if ufind && ufind.authenticate(@user.password)
      sign_in(ufind)
      return redirect_to root_path, notice: 'Logged in'
    else
      flash.now[:alert] = "Nickname or password is invalid"
    end
  end

  # DELETE /resource/sign_out
  # def destroy
  #   super
  # end

  protected

  def configure_sign_in_params
    params.require(:user).permit(:nickname, :password)
  end
  # If you have extra params to permit, append them to the sanitizer.
  #def configure_sign_in_params
  #  devise_parameter_sanitizer.permit(:sign_in, keys: [:nickname, :password])
  #end
end
