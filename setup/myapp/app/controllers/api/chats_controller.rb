class Api::ChatsController < ApplicationController
    def index
        @chats = Chat.all
        render json: @chats
    end

    def show
        @chat = Chat.find(params[:id])
        render json: @chat
    end

    def create
        Chat.create(params[:chat])
    end
end
