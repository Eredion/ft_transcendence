class AvailableGuildsChannel < ApplicationCable::Channel
  def subscribed
    stream_from "available_guilds"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
