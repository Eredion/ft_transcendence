class EndTournamentJob < ApplicationJob
  queue_as :default

  def perform(tournament)
    tournament.status = "finished"    
    history = []
    tournament.users.sort_by {|user| [user.tournament_victories, -(user.tournament_defeats)] }
    tournament.users.each do |user|
      if user.tournament_victories == tournament.users[0].tournament_victories && user.tournament_defeats == tournament.users[0].tournament_defeats 
        if user.guild_id
          guild = Guild.find_by(id: user.guild_id)
          guild.score += 50
          guild.save
        end
      else
        break
      end
    end
    tournament.users.each do |user|
      history_user = {
        :nickname => user.nickname,
        :victories => user.tournament_victories,
        :defeats => user.tournament_defeats,
        :id => user.id,
      }
      history.push(history_user)
      user.tournament_defeats = 0
      user.tournament_victories = 0
      user.intournament = false 
      user.save
    end
    tournament.history = JSON.generate(history)
    tournament.users = []
    puts history
    tournament.save
    # Do something later
    data = {
      'action':'tournament_is_finished'
    }
    ActionCable.server.broadcast "tournament_channel", data
    #EndTournamentJob.set(wait_until: tournament.finishdate).perform_later(tournament)
  end

end
