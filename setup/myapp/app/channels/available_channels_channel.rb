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

  def force_render_channel_list
    ActionCable.server.broadcast "available_channels_channel",
      "force_render_channel_list"
    puts "sending update order"
  end
end
