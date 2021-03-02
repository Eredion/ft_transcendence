class EndTournamentJob < ApplicationJob
  queue_as :default

  def perform(tournament)
    tournament.status = "finished"
    history = {}
    history_user = {}
    tournament.users.each do |user|
      history_user.nickname = user.nickname
      history_user.victories = user.tournament_victories
      history_user.defeats = user.tournament_tournament_defeats
      history.push(history_user)
      user.tournament_defeats = 0
      user.tournament_victories = 0
      user.intournament = false 
      user.save
    tournament.history = JSON.generate(history)
    tournament.users = nil
    puts history
    tournament.save
    end
    # Do something later
    data = {
      'action':'tournament_is_finished'
    }
    ActionCable.server.broadcast "tournament_channel", data
    #EndTournamentJob.set(wait_until: tournament.finishdate).perform_later(tournament)
  end

end
