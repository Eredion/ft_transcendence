class DmChannel < ApplicationCable::Channel
  def subscribed
   puts "Me uno a dm + dm_#{current_user.id}"
   stream_from "dm_#{current_user.id}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
