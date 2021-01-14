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
                fusers = user.as_json(only: [:id, :nickname, :avatar, :name, :guild_id, :score, :matches_won, :matches_lost])
                render json: fusers, status: :ok
            end
        end
    end

    private

    def set_user
        fuser = User.find(params[:id])
        @user = fuser.as_json(only: [:id, :nickname, :avatar])
    end
end
