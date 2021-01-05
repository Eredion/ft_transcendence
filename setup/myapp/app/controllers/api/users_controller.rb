class Api::UsersController < ApplicationController
    def index
        @users = User.all
        render json: @users
    end

    def show
        @user = User.find(params[:id])
        render json: @user
    end

    def create
        @todo = User.create!(todo_params)
        json_response(@todo, :created)
      end
end
