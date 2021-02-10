class MatchmakingChannel < ApplicationCable::Channel
  def subscribed
    stream_from "Matchmaking_#{params[:id]}"
  end

  def unsubscribed
    if user = Matchmaking.find_by(:user_id => current_user.id)
      user.destroy
    end
  end

  def search_game
    # search for the first user who is waiting for a match of type quick game
    # if true a match can be created, game_found action is sent
    SearchGameJob.perform_later(current_user)
  end
end
