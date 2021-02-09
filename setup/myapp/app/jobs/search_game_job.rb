class SearchGameJob < ApplicationJob
    class MatchAlreadyFound < StandardError; end
    queue_as :default
    discard_on ActiveJob::DeserializationError
    discard_on MatchAlreadyFound

    before_perform do |job|
        player = job.arguments.first
        puts "before_perform #{player}"
        have_match = Match.where(left_player: player.id, finished: false).or(Match.where(right_player: player.id, finished: false)).first
        return raise MatchAlreadyFound.new if have_match # Stop searching if player have a current match
    end

    def perform(player)
        puts "SearchGameJob #{player.nickname}"
        if opponent = Matchmaking.where.not(:user_id => player.id).where(:match_type => 'quick game').first
            player1 = player.as_json(only: [:id, :nickname, :avatar, :score])
            player2 = opponent.user.as_json(only: [:id, :nickname, :avatar, :score])
            l_player, r_player = [player, opponent.user].shuffle
            match = Match.create!(match_type: "quick game", left_player_id: l_player.id, right_player_id: r_player.id)
            ActionCable.server.broadcast( "Matchmaking_#{player.id}", { action: 'game_found' , player1: player1, player2: player2, match: match.id } )
            ActionCable.server.broadcast( "Matchmaking_#{opponent.user_id}", { action: 'game_found' , player1: player2, player2: player1, match: match.id } )
            Matchmaking.delete(opponent.id)
            # if not the user is added for the next user search
            # searching action is sent
        else
            ActionCable.server.broadcast( "Matchmaking_#{player.id}", { action: 'searching' } )
            if !Matchmaking.where(user_id: player.id).exists?
                Matchmaking.create!(user: player, match_type: 'quick game')
            end
            SearchGameJob.set(wait: 7.seconds).perform_later(player)
        end
    end
end
  