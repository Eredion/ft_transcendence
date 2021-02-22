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
        if (tour = Tournament.new(params_tournament))
            size = params[:size].to_i
            tour.size = size
            if (tour.size == 2)
                tour.rounds.push(Round.create(number: 0))
            elsif (tour.size == 4)
                tour.rounds.push(Round.create(number: 0))
                tour.rounds.push(Round.create(number: 1))
            elsif (tour.size == 8)
                tour.rounds.push(Round.create(number: 0))
                tour.rounds.push(Round.create(number: 1))
                tour.rounds.push(Round.create(number: 2))
            end
            p tour.users
            tour.save
        else
            puts(Rails.logger.info(tour.errors.inspect))
        end
    end

    private
    def params_tournament
        params.require(:tournament).permit(:name, :size)
    end
end