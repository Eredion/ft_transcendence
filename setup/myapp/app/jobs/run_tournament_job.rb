class RunTournamentJob < ApplicationJob
  queue_as :default

  def perform(tournament)
    if (tournament.status == "finished")
        return
    end
    puts "Tournament is now active"
    tournament.status = "active"
    tournament.save
    data = {
      'action':'tournament_is_active'
    }
    ActionCable.server.broadcast "tournament_channel", data
    EndTournamentJob.set(wait_until: tournament.finishdate).perform_later(tournament)
    # Do something later
  end
end
