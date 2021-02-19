class LoopGameJob < ApplicationJob
    queue_as :default

    def perform(match_id)
        game = Pong.get_game(match_id)
        loop do
            match = game.get_match
            if match.finished
				puts match.as_json
				puts match.winner_id
				puts match[:winner_id]
				puts rank_points(match)
                break
            end
            game.move_ball
            game.send_moves
            sleep 0.5 # 25fps
        end
    end

	def rank_points(match)
		puts "Hola desde rank_points"
		match.winner_id
		loser = User.find_by(id: match[:loser_id])
		winner = User.find_by(id: match[:winner_id])
		dif_points = (loser.score - winner.score) / 10
		winner.score += 100 + (dif_points < -50 ? -50 : dif_points)
		loser.score -= 100 + (dif_points > 50 ? 50 : dif_points)
		if loser.score <= 0
			loser.score = 0
		end
		winner.save
		loser.save
		if winner.guild_id
			winner_guild = Guild.find_by(id: winner.guild_id)
			winner_guild.score += 10
			winner_guild.save
		end

	end
end
