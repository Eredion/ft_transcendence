class WarEndJob < ApplicationJob
  queue_as :default

  def perform(war)

    war.guilds.each do |guild|
      ActionCable.server.broadcast( "Guild_#{guild.id}", {
        action: 'update_info'
      }
    end

    WarTimeOffJob.perform_later(war)
    winner = war.guilds[0].warvictories > war.guilds[1].warvictories ? war.guilds[0] : war.guilds[1]
    loser = war.guilds[0].warvictories > war.guilds[1].warvictories ? war.guilds[1] : war.guilds[0]

    war_history_hash = {
      :winner => winner.title,
      :winner_victories => winner.warvictories,
      :winner_anagram => winner.anagram,
      :loser => loser.title,
      :loser_victories => loser.warvictories, 
      :loser_anagram => loser.anagram,
    }
    war_history_string = JSON.generate(war_history_hash)

    [winner, loser].each do |guild|
      guild.warvictories = 0
      guild.wardefeats = 0
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
