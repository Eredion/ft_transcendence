class Api::UsersController < ApplicationController
    def index
        users = User.all
        fusers = users.as_json(only: [:id, :nickname, :avatar])
        render json: fusers
    end

    def show
        user = User.find(params[:id])
        fuser = user.as_json(only: [:id, :nickname, :avatar])
        render json: fuser
    end

    def create
        @user = User.create!(params)
        json_response(@user, :created)
      end
end
