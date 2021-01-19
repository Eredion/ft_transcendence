class Api::ChatsController < ApplicationController
  skip_before_action:verify_authenticity_token
  
    def index
        @chats = Chat.all
        render json: @chats
    end

    def show
        @chat = Chat.find(params[:id])
        render json: @chat
    end

    def create
      puts(params)
      Chat.create(chat_params)
    end

    def update
        puts(params)
        @chat = Chat.find(params[:id])
        puts(@chat.name)
        @chat.update(chat_params)
    end

    private
    def chat_params
      params.require(:chat).permit(:name, :users, :messages)
    end   

end
