class ActiveMatchesChannel < ApplicationCable::Channel
  def subscribed
    stream_from "active_matches"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
