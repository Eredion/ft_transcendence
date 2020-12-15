class MessagesController < ApplicationController
  before_action :authenticate_user!
  def create
    @message = Message.new(message_params)
    @message.user = current_user
    if @message.content == ''
      return
    end
    if @message.save
      ActionCable.server.broadcast "chat_channel",
                                      content: @message.created_at.strftime("%k:%M:%S")+ ": " + @message.user.nickname.capitalize() +": " + @message.content      
    else
      
    end
  end

  private
  def message_params
    params.require(:message).permit(:content)
  end


end
