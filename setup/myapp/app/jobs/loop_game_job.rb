class LoopGameJob < ApplicationJob
    queue_as :default

    def perform(match_id)
        game = Pong.get_game(match_id)
        loop do
			match = game.get_match
			if match.finished
				endgame(match)
				break
			end
			if match.status == "running"
				game.move_ball
				game.send_moves
				sleep 0.04 # 25fps
			elsif match.status == "waiting" || match.status == "pause"
				sleep 0.5
			end
        end
    end

	def endgame(match)
		match.status = "finished"
		loser = User.find_by(id: match[:loser_id])
		winner = User.find_by(id: match[:winner_id])
		winner.matches_won += 1
		loser.matches_lost += 1
		if winner.guild_id != nil
			winner_guild = Guild.find_by(id: winner.guild_id)
		end
		if loser.guild_id != nil
			loser_guild = Guild.find_by(id: loser.guild_id)			
		end
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
			if winner.guild_id
				winner_guild.score += (match.winner_points / 10)
				winner_guild.save
			end
		elsif match.match_type == "tournament game"
			loser.tournament_defeats += 1
			winner.tournament_victories += 1
		end
		if winner.guild_id && loser.guild_id
			if winner_guild.war_id
				war = War.find_by(id: winner_guild.war_id)
				if loser_guild.in?(war.guilds) &&
					((match.match_type == "tournament game" && war.type_tournament == true) ||
					(match.match_type == "ranked game" && war.type_ranked == true) ||
					match.match_type == "war game" || match.match_type == "challenge game")
					
					winner_guild.warvictories += 1
					match.war = true
					if match.match_type == "war game"
						winner_guild.war_playing = false
						loser_guild.war_playing = false
					end
					winner_guild.save
					loser_guild.save
				end
			end
		end
		match.save
		winner.save
		loser.save
		ActionCable.server.broadcast( "Match_#{match.id}", { action: 'finish_game' , match: match.complete_data } )
		ActionCable.server.broadcast( 'active_matches', { action: 'update_matches' } )
		winner.update(status: 1)
		loser.update(status: 1)
		ActionCable.server.broadcast( "user_status", { id: winner.id, status: 1} )
		ActionCable.server.broadcast( "user_status", { id: loser.id, status: 1} )
	end

end
