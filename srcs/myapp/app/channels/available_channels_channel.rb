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
  end

  def kick(data)
    channel = Channel.find_by(name: data["channel"])
    channel.banned.push(data["user"].to_i)
    channel.members.delete(data["user"].to_i)
    channel.save
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

  def  destroy_channel(data)
    channel = Channel.find_by(name: data["channel"])
    channel.messages.each{|msg_id| Message.find_by(id: msg_id).destroy}
    channel.messages.destroy
    channel.destroy
    ActionCable.server.broadcast "available_channels_channel",
      {"action":"force_render_all", "channel": data["channel"]}
  end

end
