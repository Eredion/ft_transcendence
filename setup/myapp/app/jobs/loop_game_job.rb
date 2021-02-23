class LoopGameJob < ApplicationJob
    queue_as :default

    def perform(match_id)
        game = Pong.get_game(match_id)
        loop do
            match = game.get_match
            if match.finished
				puts rank_points(match)
                break
            end
            game.move_ball
            game.send_moves
            sleep 0.04 # 25fps
        end
    end

	def rank_points(match)
		loser = User.find_by(id: match[:loser_id])
		winner = User.find_by(id: match[:winner_id])
		if match.match_type == "ranked game"
			match.winner_id
			dif_points = (loser.score - winner.score) / 10
			match.winner_points = 100 + dif_points
			match.loser_points = match.winner_points
			if match.winner_points < 50
				match.winner_points = 0
			end
			if match.loser_points > 150
				match.loser_points = 10
			end
			winner.score += match.winner_points
			loser.score -= match.loser_points
			if loser.score <= 0
				loser.score = 0
			end
			winner.save
			loser.save
			if winner.guild_id
				winner_guild = Guild.find_by(id: winner.guild_id)
				winner_guild.score += (match.winner_points / 10)
				winner_guild.save
			end
		elsif match.match_type == "tournament game"
			loser.tournament_defeats += 1
			winner.tournament_victories += 1
			winner.save
			loser.save
		end
		ActionCable.server.broadcast( "Match_#{match.id}", { action: 'finish_game' , match: match } )
	end
end
