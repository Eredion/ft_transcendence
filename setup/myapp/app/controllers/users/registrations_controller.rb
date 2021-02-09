# frozen_string_literal: true

class Users::RegistrationsController < Devise::RegistrationsController
  # before_action :configure_sign_up_params, only: [:create]
  # before_action :configure_account_update_params, only: [:update]

  # GET /resource/sign_up
  # def new
  #   super
  # end

  def create
    user = User.new user_params
    if user.save
      sign_in(user)
      #render json: {data: 'OK'}, status: :ok
      respond_to do |format|
        format.json { render json: { location: root_path, status: 'ok' } }
      end
      #redirect_to root_path
    else
      flash.now[:alert] = "Some error ocurred. Try again"
      respond_to do |format|
        format.json { render json: { location: :signup, status: 'ko' } }
      end
      #render json: {data: 'KO'}, status: internal_server_error
      #flash[:alert] = "Nickname or password is invalid"
      #format.html { redirect_to create_user_registration}
    end

  end


  private

  def user_params
    params.permit(:nickname, :email, :password, :password_confirmation)
  end
  
  # GET /resource/edit
  # def edit
  #   super
  # end

  # PUT /resource
  # def update
  #   super
  # end

  # DELETE /resource
  # def destroy
  #   super
  # end

  # GET /resource/cancel
  # Forces the session data which is usually expired after sign
  # in to be expired now. This is useful if the user wants to
  # cancel oauth signing in/up in the middle of the process,
  # removing all OAuth session data.
  # def cancel
  #   super
  # end

  # protected

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_sign_up_params
  #   devise_parameter_sanitizer.permit(:sign_up, keys: [:attribute])
  # end

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_account_update_params
  #   devise_parameter_sanitizer.permit(:account_update, keys: [:attribute])
  # end

  # The path used after sign up.
  # def after_sign_up_path_for(resource)
  #   super(resource)
  # end

  # The path used after sign up for inactive accounts.
  # def after_inactive_sign_up_path_for(resource)
  #   super(resource)
  # end
end
