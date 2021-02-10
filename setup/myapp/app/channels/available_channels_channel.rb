class AvailableChannelsChannel < ApplicationCable::Channel
  def subscribed
    stream_from "available_channels_channel"
  end

  def unsubscribed
  end
end
