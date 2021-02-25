class EndTournamentJob < ApplicationJob
  queue_as :default

  def perform(tournament)
    tournament.status = "finished"
    tournament.save
    tournament.users.each do |user|
      user.intournament = false
      user.save
    end
    # Do something later
    data = {
      'action':'tournament_is_finished'
    }
    ActionCable.server.broadcast "tournament_channel", data
    #EndTournamentJob.set(wait_until: tournament.finishdate).perform_later(tournament)
  end

end
