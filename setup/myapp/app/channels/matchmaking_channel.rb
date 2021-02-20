class MatchmakingChannel < ApplicationCable::Channel
  def subscribed
    stream_from "Matchmaking_#{params[:id]}"
  end

  def unsubscribed
    Matchmaking.destroy_by(user_id: current_user.id)
  end

  def quick_game
	  puts "quick_game"
      QuickGameJob.perform_later(current_user)
  end

  def ranked_game
      RankedGameJob.perform_later(current_user)
  end

  def wait_peer(data)
    puts data["peer"]
    puts "finding someone to dance with"
    user = User.find_by(id: data["peer"].to_i)
    user.send_notification('notification', 'challenge', current_user.nickname, {"from": current_user.id})
    ChallengeJob.perform_later(current_user, User.find_by(id: data["peer"].to_i))
  end

  def accept_peer(data)
    puts data["peer"]
    puts "accepting someone to dance with"
    user = User.find_by(id: data["peer"].to_i)
    #user.send_notification('notification', 'challenge', current_user.nickname, {"from": current_user.id})
    ChallengeJob.perform_later(current_user, User.find_by(id: data["peer"].to_i))
  end
end
