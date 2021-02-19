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
            sleep 0.4 # 25fps
        end
    end

	def rank_points(match)
		if match.match_type != "ranked game"
			return
		end
		match.winner_id
		loser = User.find_by(id: match[:loser_id])
		winner = User.find_by(id: match[:winner_id])
		dif_points = (loser.score - winner.score) / 10
		winner_points = 100 + dif_points
		loser_points = winner_points
		if winner_points < 50
			winner_points = 0
		end
		if loser_points > 150
			loser_points = 10
		end
		winner.score += winner_points
		loser.score -= loser_points
		if loser.score <= 0
			loser.score = 0
		end
		winner.save
		loser.save
		if winner.guild_id
			winner_guild = Guild.find_by(id: winner.guild_id)
			winner_guild.score += (winner_points / 10)
			winner_guild.save
		end
	end
end
