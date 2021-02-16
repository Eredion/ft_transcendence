class AvailableChannelsChannel < ApplicationCable::Channel
  def subscribed
    stream_from "available_channels_channel"
  end

  def unsubscribed
  end

  def silence(data)
    SilenceJob.perform_later(data["id"], data["channel"], data["tsec"])
  end

  def force_render_channel_list
    ActionCable.server.broadcast "available_channels_channel",
      "force_render_channel_list"
    puts "sending update order"
  end

  def kick(data)
    ActionCable.server.broadcast "available_channels_channel",
      {"action":"kick", "user_id": data["user"], "channel": data["channel"] }
  end

  def setAdmin(data)
    channel = Channel.find_by(name: data["channel"])
    if (data['id'].to_i.in?(channel.admins) == false)
      channel.admins.push(data['id'].to_i)
      channel.save       
    end
  end
end
