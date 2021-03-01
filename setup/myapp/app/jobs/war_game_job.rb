class WarGameJob < ApplicationJob
  queue_as :default

  def perform(player, war)

      search = true
      if Matchmaking.where(user_id: player.id, match_type: 'war game').exists?
          search = false
      else
          Matchmaking.create!(user: player, match_type: 'war game')
      end

      loop do
              # if player dont exists in Matchmaking stop searching
              # reasons:
              # - stopped manually unsubscribed from channel
              # - already found a match
          Matchmaking.uncached do
              if !Matchmaking.where(user_id: player.id).exists?
                  search = false
              end
          end

          if !search
              break
          end

          # Stop searching if player have a current match
          if have_match = Match.where(left_player: player.id, finished: false).or(Match.where(right_player: player.id, finished: false)).first
              ActionCable.server.broadcast( "Matchmaking_#{player.id}", { action: 'current_game' , match: have_match.id } )
              break
          end

              # opponent found!
          if opponent = Matchmaking.where.not(:user_id => player.id).where(:match_type => 'war game').first
              #p2 = User.find_by(id: opponent.user_id)
              p2_gid = User.find_by(id: opponent.user_id).guild_id
              #p2_guild = Guild.find_by(id: p2.guild_id)
              #p1_guild = Guild.find_by(id: player.guild_id)
              if war.guilds[0].id != p2_gid && war.guilds[1].id != p2_gid #Check if the oponent is in my war
                puts "Ese pavo no está en nuestra guerra"
                ActionCable.server.broadcast( "Matchmaking_#{player.id}", { action: 'searching' } )
                sleep 7
                next # Equals to continue in a C loop
              end
              puts "Adelante, estais en la misma guerra"

              player1 = player.as_json(only: [:id, :nickname, :avatar, :score,])
              player2 = opponent.user.as_json(only: [:id, :nickname, :avatar, :score])
              l_player, r_player = [player, opponent.user].shuffle
              match = Match.create!(match_type: "war game", left_player_id: l_player.id, right_player_id: r_player.id)
              ActionCable.server.broadcast( "Matchmaking_#{player.id}", { action: 'game_found' , player1: player1, player2: player2, match: match.id } )
              ActionCable.server.broadcast( "Matchmaking_#{opponent.user_id}", { action: 'game_found' , player1: player2, player2: player1, match: match.id } )
              Matchmaking.destroy_by(user_id: opponent.id)
              break
          else
              # searching action is sent
              ActionCable.server.broadcast( "Matchmaking_#{player.id}", { action: 'searching' } )
              sleep 7
          end
      end
      Matchmaking.destroy_by(user_id: player.id)
  end
end
