class AvailableChatChannel < ApplicationCable::Channel
  def subscribed
    stream_from "available_chat_channel"
    ActionCable.server.broadcast "available_chat_channel",
      current_user.nickname
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

end

