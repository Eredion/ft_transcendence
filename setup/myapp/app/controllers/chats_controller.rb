class ChatsController < ApplicationController
	def create
        @chat = Chat.new(project_params)

        if @chat.save
          @chat.messages.create(content: "Este chat esta vacío, di hola!", user_id: 1)
        end
    end

  private
  def project_params
    params.require(:chat).permit(:name, :users, :messages)
  end
end
