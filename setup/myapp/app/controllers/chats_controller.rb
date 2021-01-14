class ChatsController < ApplicationController
	def create
        @chat = Chat.new(project_params)
        
        if @chat.save
          @chat.messages.create(content: "Aquí comienza la conversación", user_id: 1)
          puts("Chat saved")
        end
    end
  
  private
  def project_params
    params.require(:chat).permit(:name, :users, :messages)
  end
end
