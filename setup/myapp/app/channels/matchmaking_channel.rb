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
    if opponent = Matchmaking.where(:match_type => 'quick game').first
      player1 = current_user.as_json(only: [:id, :nickname, :avatar, :score])
      player2 = opponent.user.as_json(only: [:id, :nickname, :avatar, :score])
      ActionCable.server.broadcast( "Matchmaking_#{current_user.id}", { action: 'game_found' , player1: player1, player2: player2 } )
      ActionCable.server.broadcast( "Matchmaking_#{opponent.user_id}", { action: 'game_found' , player1: player2, player2: player1 } )
      Matchmaking.delete(opponent.id)
    # if not the user is added for the next user search
    # searching action is sent
    else
      ActionCable.server.broadcast( "Matchmaking_#{current_user.id}", { action: 'searching' } )
      Matchmaking.create!(user: current_user, match_type: 'quick game')
    end
  end
end
