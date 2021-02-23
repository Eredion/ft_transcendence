class RunTournamentJob < ApplicationJob
  queue_as :default

  def perform(tournament)
    puts "Tournament is now active"
    tournament.status = "active"
    tournament.save
    EndTournamentJob.set(wait_until: tournament.finishdate).perform_later(tournament)
    # Do something later
  end
end
