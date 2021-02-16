class AvailableChannelsChannel < ApplicationCable::Channel
  def subscribed
    stream_from "available_channels_channel"
  end

  def unsubscribed
  end

  def silence(data)
    SilenceJob.perform_later(data["id"], data["channel"], data["tsec"])
  end

  def setAdmin(data)
    channel = Channel.find_by(name: data["channel"])
    puts("Que si quiere bolsa")
    if (data['id'].to_i.in?(channel.admins) == false)
      channel.admins.push(data['id'].to_i)
      channel.save       
    end
  end
end
