class PlayroomChannel < ApplicationCable::Channel
  def subscribed
    stream_from "playroom_#{params[:room]}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def keypress
    ActionCable.server.broadcast "playroom_#{params[:room]}",
        1
  end
end
