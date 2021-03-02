class EndTournamentJob < ApplicationJob
  queue_as :default

  def perform(tournament)
    tournament.status = "finished"    
    history = []
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
    history.sort_by {|h| [ h[:victories].to_i, h[:defeats].to_i ]}
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
