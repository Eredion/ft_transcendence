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
      @chat = Chat.find(params[:name])
      if @chat.exists?
        return
      else
        @chat = Chat.create(chat_params)
      end
      return @chat
    end

    def update
        @chat = Chat.find(params[:id])
        @chat.update(chat_params)
    end

    private
    def chat_params
      params.require(:chat).permit(:name, :messages)
    end   

end
