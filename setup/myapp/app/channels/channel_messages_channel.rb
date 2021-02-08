class ChannelMessagesChannel < ApplicationCable::Channel
  def subscribed
    puts("SUSCRITO A " + "channel_messages_#{params[:name]}")
    stream_from "channel_messages_#{params[:name]}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
