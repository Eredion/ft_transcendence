class UsersController < ApplicationController

    before_action :authenticate_user!, :set_user, only: [:show]

    def sign_in
        @user = User.new
    end

    # GET users/:id
    def show
        return render json: @user
    end

    private

    def set_user
        fuser = User.find(params[:id])
        @user = fuser.as_json(only: [:id, :nickname])
    end
end
