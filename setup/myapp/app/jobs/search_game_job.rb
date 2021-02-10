class SearchGameJob < ApplicationJob
    class MatchAlreadyFound < StandardError; end
    queue_as :default
    discard_on ActiveJob::DeserializationError
    discard_on SearchGameJob::MatchAlreadyFound do |job, error|
        ExceptionNotifier.caught(error)
    end

    before_perform do |job|
        player = job.arguments.first
        p "before_perform #{player}"
        have_match = Match.where(left_player: player.id, finished: false).or(Match.where(right_player: player.id, finished: false)).first
        if have_match # Stop searching if player have a current match
            ActionCable.server.broadcast( "Matchmaking_#{player.id}", { action: 'current_game' , match: have_match.id } )
            raise MatchAlreadyFound.new("#{player.nickname} already have a match")
        end
    end

    def perform(player)
        # to do: search opponent depending on the score
        if opponent = Matchmaking.where.not(:user_id => player.id).where(:match_type => 'quick game').first
            player1 = player.as_json(only: [:id, :nickname, :avatar, :score])
            player2 = opponent.user.as_json(only: [:id, :nickname, :avatar, :score])
            l_player, r_player = [player, opponent.user].shuffle
            match = Match.create!(match_type: "quick game", left_player_id: l_player.id, right_player_id: r_player.id)
            ActionCable.server.broadcast( "Matchmaking_#{player.id}", { action: 'game_found' , player1: player1, player2: player2, match: match.id } )
            ActionCable.server.broadcast( "Matchmaking_#{opponent.user_id}", { action: 'game_found' , player1: player2, player2: player1, match: match.id } )
            
            # remove players from matchmaking is exists
            if Matchmaking.where(user_id: opponent.id).exists?
                Matchmaking.delete(opponent.id)
            end
            if Matchmaking.where(user_id: player.id).exists?
                Matchmaking.delete(player.id)
            end
        else
            # ifnot the user is added to the queue
            # searching action is sent
            ActionCable.server.broadcast( "Matchmaking_#{player.id}", { action: 'searching' } )
            if !Matchmaking.where(user_id: player.id).exists?
                Matchmaking.create!(user: player, match_type: 'quick game')
            end
            SearchGameJob.set(wait: 7.seconds).perform_later(player)
        end
    end
end
