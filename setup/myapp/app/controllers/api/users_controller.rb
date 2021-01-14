class Api::UsersController < ApplicationController
    protect_from_forgery
    before_action :authenticate_user!

    def index
        users = User.all
        fusers = users.as_json(only: [:id, :nickname, :avatar, :name, :guild_id, :score, :matches_won, :matches_lost])
        render json: fusers
    end

    def show
        user = User.find(params[:id])
        fuser = user.as_json(only: [:id, :nickname, :avatar, :name, :guild_id, :score, :matches_won, :matches_lost])
        render json: fuser
    end

    def create
        @user = User.create!(params)
        json_response(@user, :created)
    end

    def update
        user = User.find(current_user.id)
        if params[:nickname] != user.nickname
            user.nickname = params[:nickname]
        end
        if params[:name] != user.name
            user.name = params[:name]
        end
        if user.save!
            render json: user, status: :ok
        end
    end
end
