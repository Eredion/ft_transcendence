class OpenTournamentJob < ApplicationJob
  queue_as :default

  def perform(tournament)
    tournament.status = "open"
    tournament.save
    RunTournamentJob.set(wait_until: tournament.startdate).perform_later(tournament)
  end
end
