class UserStatusChannel < ApplicationCable::Channel
  def subscribed
    stream_from "user_status"
    current_user.update(status: 1) # online
    ActionCable.server.broadcast( "user_status", { id: current_user.id, status: 1} )
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
    current_user.update(status: 0) # offline
    ActionCable.server.broadcast( "user_status", { id: current_user.id, status: 0} )
  end
end
