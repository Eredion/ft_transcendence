class Api::TournamentsController < ApplicationController
    def index
        tournaments = Tournament.all
        render json: tournaments
    end

    def show
        tournament = Tournaments.find(params[:id])
        render json: tournament
    end

    def create
        Tournament.delete_all
        if (tour = Tournament.new(params_tournament))
            puts tour.startdate
            timelen = (params_tournament[:finishdate] == "short") ? 1.minutes : 5.minutes
            tour.finishdate = tour.startdate + timelen
            if tour.save
                OpenTournamentJob.set(wait_until: tour.startdate).perform_later(tour)
                User.all.each do |u|
                    u.intournament = false
                    u.tournament_victories = 0
                    u.tournament_defeats = 0
                    u.save
                end
            end
        else
            puts(Rails.logger.info(tour.errors.inspect))
        end
    end

    private
    def params_tournament
        params.require(:tournament).permit(:name, :startdate, :finishdate)
    end
end