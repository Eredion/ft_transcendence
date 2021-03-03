class MatchmakingChannel < ApplicationCable::Channel
  def subscribed
    stream_from "Matchmaking_#{params[:id]}"
  end

  def unsubscribed
    Matchmaking.destroy_by(user_id: current_user.id)
  end

  def quick_game
    QuickGameJob.perform_later(current_user)
  end

  def ranked_game
    RankedGameJob.perform_later(current_user)
  end

  def tournament_game
    user = User.find_by(id: current_user.id)
    if user.intournament == true
      TournamentGameJob.perform_later(current_user)
    else
      ActionCable.server.broadcast( "Matchmaking_#{user.id}", { action: 'not_tournament' })
    end
  end

  def war_game
    user = User.find_by(id: current_user.id)
    if user.guild_id
      guild = Guild.find_by(id: user.guild_id)
      if guild.inwar == true && guild.war_playing == false
        guild.war_playing = true
        guild.save
        war = War.find_by(id: guild.war_id)
        WarGameJob.perform_later(user, war)
      elsif guild.war_playing == true
        ActionCable.server.broadcast( "Matchmaking_#{user.id}", { action: 'try_later' })
      else
        ActionCable.server.broadcast( "Matchmaking_#{user.id}", { action: 'not_war' })
      end
    else
      ActionCable.server.broadcast( "Matchmaking_#{user.id}", { action: 'not_war' })
    end
  end

  def wait_peer(data)
    puts data["peer"]
    puts "finding someone to dance with"
    user = User.find_by(id: data["peer"].to_i)
    user.send_notification('notification', 'challenge', current_user.nickname, {"from": current_user.id})
    ChallengeJob.perform_later(current_user, User.find_by(id: data["peer"].to_i))
  end

  def accept_peer(data)
    puts data["peer"]
    puts "accepting someone to dance with"
    user = User.find_by(id: data["peer"].to_i)
    #user.send_notification('notification', 'challenge', current_user.nickname, {"from": current_user.id})
    ChallengeJob.perform_later(current_user, User.find_by(id: data["peer"].to_i))
  end

  def miss_match
    user = User.find_by(id: current_user.id)
    guild = Guild.find_by(id: user.guild_id)
    war = War.find_by(id: guild.war_id)
    guild.warvictories += 1
    guild.missed_matches += 1
    guild.war_playing = false
    guild.save
    if (guild.missed_matches >= war.missed_matches)
      WarTimeOffJob.perform_now(war)
    end
  end

end
