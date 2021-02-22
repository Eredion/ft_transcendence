class TournamentChannel < ApplicationCable::Channel
  def subscribed
    stream_from "tournament"
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
    p tour.users
  end
end
