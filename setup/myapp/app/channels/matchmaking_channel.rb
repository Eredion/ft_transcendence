class MatchmakingChannel < ApplicationCable::Channel
  def subscribed
    stream_from "Matchmaking_#{params[:id]}"
  end

  def unsubscribed
    Matchmaking.destroy_by(user_id: current_user.id)
  end

  def search_game
      SearchGameJob.perform_later(current_user)
  end
end
