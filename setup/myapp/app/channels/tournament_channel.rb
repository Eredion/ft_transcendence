class TournamentChannel < ApplicationCable::Channel
  def subscribed
    stream_from "tournament_channel"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def join_user(data)
    user = User.find_by(id: data["userid"])
    user.intournament = true
    tour = Tournament.last
    if (user.in?(tour.users) || tour.status != "open")
      return
    end
    tour.users.push(user)
    
    tour.save
    data = {
      'action':'join_user',
      'user': user.as_json,
    }
    ActionCable.server.broadcast "tournament_channel", data
  end

end
