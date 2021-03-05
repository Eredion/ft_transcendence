class WarEndJob < ApplicationJob
  queue_as :default

  def perform(war, cancelled=false)

    war.guilds.each do |guild|
      ActionCable.server.broadcast( "Guild_#{guild.id}", {
        action: 'update_info'
      })
    end
    if cancelled == true
      war.guilds[0].war_id = nil
      war.guilds[1].war_id = nil
      war.guilds[0].inwar = false
      war.guilds[1].inwar = false
      war.guilds[0].save
      war.guilds[1].save
      war.save
      war.destroy
      return
    end

    WarTimeOffJob.perform_later(war)
    winner = war.guilds[0].warvictories > war.guilds[1].warvictories ? war.guilds[0] : war.guilds[1]
    loser = war.guilds[0].warvictories > war.guilds[1].warvictories ? war.guilds[1] : war.guilds[0]
    tie = (winner.warvictories == loser.warvictories ? true : false)
    war_history_hash = {
      :winner => winner.title,
      :winner_victories => winner.warvictories,
      :winner_anagram => winner.anagram,
      :loser => loser.title,
      :loser_victories => loser.warvictories,
      :loser_anagram => loser.anagram,
      :tie => tie,
    }
    war_history_string = JSON.generate(war_history_hash)
    if tie == false
      winner.score += war.bet
      loser.score -= war.bet
    end
    
    [winner, loser].each do |guild|
      guild.warvictories = 0
      guild.missed_matches = 0
      guild.war_playing = false
      guild.inwar = false
      guild.war_id = nil
      guild.war_history.push(war_history_string)
      guild.save
    end
    war.status = "finished"
    war.save
    # Do something later
  end
end
