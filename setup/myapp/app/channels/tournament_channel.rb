class TournamentChannel < ApplicationCable::Channel
  def subscribed
    stream_from "tournament_channel"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def join_user(data)
    user = User.find_by(id: data["userid"])
    tour = Tournament.find_by(id: data["id"])
    if (user.in?(tour.users) || tour.status != "open")
      return
    end
    tour.users.push(user)
    if (tour.users.length == tour.size)
      tour.status = "closed"
    end
    tour.save
    data = {
      'action':'join_user',
      'user': user.as_json,
    }
    ActionCable.server.broadcast "tournament_channel", data
  end
end
