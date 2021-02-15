class AvailableChannelsChannel < ApplicationCable::Channel
  def subscribed
    stream_from "available_channels_channel"
  end

  def unsubscribed
  end

  def silence(data)
    puts "entra"
    SilenceJob.perform_later(data["id"], data["channel"], data["tsec"])
  end
end
