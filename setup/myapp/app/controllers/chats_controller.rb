class ChatsController < ApplicationController
	def create
        @chat = Chat.new(project_params)
        if @chat.save
          puts("Chat saved")
        end
    end
  
  private
  def project_params
    params.require(:chat).permit(:name, :users, :messages)
  end
end
