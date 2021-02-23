class EndTournamentJob < ApplicationJob
  queue_as :default

  def perform(tournament)
    tournament.status = "finished"
    tournament.save
    # Do something later
  end
end
