class Api::ChatsController < ApplicationController
  protect_from_forgery
  before_action :authenticate_user!
  
    def index
        chats = Chat.all
        render json: chats
    end

    def show
        chat = Chat.find_by(id: params[:id])
        render json: chat
    end

    def create
      @chat = Chat.find_by(name: params[:name])
      if @chat.exists?
        return
      else
        @chat = Chat.create(chat_params)
      end
      return @chat
    end

    def update
        @chat = Chat.find_by(id: params[:id])
        @chat.update(chat_params)
    end

    private
    def chat_params
      params.require(:chat).permit(:name, :messages)
    end   

end
