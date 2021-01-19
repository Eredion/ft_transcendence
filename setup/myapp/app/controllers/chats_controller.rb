class ChatsController < ApplicationController
	def create
        @chat = Chat.new(chat_params)

        if @chat.save
          @chat.messages.create(content: "Este chat esta vacío, di hola!", user_id: "1")
        end
    end

  private
  def chat_params
    params.require(:chat).permit(:name, :users, :messages)
  end
end
