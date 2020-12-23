class UsersController < ApplicationController

    before_action :authenticate_user!, :set_user, only: [:show]

    def sign_in
        @user = User.new
    end

    # GET users/:id
    def show
        return render json: @user
    end

    def update_avatar
        user = User.find(params[:id])
        if params[:user][:avatar]
            File.open(params[:user][:avatar]) do |f|
                user.avatar = f
            end
            if user.save!
                render json: user, status: :ok
            else
                render json: user, status: 404
            end
        else
            render json: user, status: 404
        end
    end

    private

    def set_user
        fuser = User.find(params[:id])
        @user = fuser.as_json(only: [:id, :nickname])
    end
end
