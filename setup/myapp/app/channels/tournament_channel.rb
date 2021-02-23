class TournamentChannel < ApplicationCable::Channel
  def subscribed
    stream_from "tournament_channel"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def join_user(data)
    user = User.find_by(id: data["userid"])
    tour = Tournament.last
    if (user.in?(tour.users) || tour.status != "open")
      return
    end
    tour.users.push(user)
    if (tour.users.length == tour.size)
      
      assing_urls(tour)
      tour.status = "closed"
      tour.round = tour.rounds.length - 1 ## go to first round
    end
    tour.save
    data = {
      'action':'join_user',
      'user': user.as_json,
    }
    ActionCable.server.broadcast "tournament_channel", data
  end

  private
  def assing_urls(tour)
    round = tour.rounds.where(number: tour.rounds.length - 1).first
    lefturl = "challenge/"+ tour.users[1].id.to_s + "/accept/" + tour.users[0].id.to_s
    righturl = "challenge/"+ tour.users[0].id.to_s + "/accept/" + tour.users[1].id.to_s
    round.links.push(lefturl)
    round.links.push(righturl)
    if (tour.size >= 4)
      lefturl = "challenge/"+ tour.users[3].id.to_s + "/accept/" + tour.users[2].id.to_s
      righturl = "challenge/"+ tour.users[2].id.to_s + "/accept/" + tour.users[3].id.to_s
      round.links.push(lefturl)
      round.links.push(righturl)
    end
    if (tour.size == 8)
      one = "challenge/"+ tour.users[5].id.to_s + "/accept/" + tour.users[4].id.to_s
      two = "challenge/"+ tour.users[4].id.to_s + "/accept/" + tour.users[5].id.to_s
      three = "challenge/"+ tour.users[7].id.to_s  + "/accept/" + tour.users[6].id.to_s
      four = "challenge/"+ tour.users[6].id.to_s + "/accept/" + tour.users[7].id.to_s
      round.links.push(one)
      round.links.push(two)
      round.links.push(three)
      round.links.push(four)
    end
    round.save
  end
end
