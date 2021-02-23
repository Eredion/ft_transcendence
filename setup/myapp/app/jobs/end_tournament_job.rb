class EndTournamentJob < ApplicationJob
  queue_as :default

  def perform(tournament)
    tournament.status = "finished"
    tournament.save
    # Do something later
    data = {
      'action':'tournament_is_finished'
    }
    ActionCable.server.broadcast "tournament_channel", data
    EndTournamentJob.set(wait_until: tournament.finishdate).perform_later(tournament)
  end
end
