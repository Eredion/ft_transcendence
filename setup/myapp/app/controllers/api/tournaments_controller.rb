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
        Tournament.all.each do |tour|
            EndTournamentJob.perform_later(tour)
        end
        if (tour = Tournament.new(params_tournament))
            puts tour.startdate
            if (tour.startdate == nil)
                ActionCable.server.broadcast "notification_#{current_user.id}",
                {
                    action: 'alert',
                    message: 'Check that you have filled all parameters'
                }
            end
            timelen = (params_tournament[:finishdate] == "short") ? 2.minutes : 10.minutes
            tour.finishdate = tour.startdate + timelen
            if tour.save
                OpenTournamentJob.perform_later(tour)
                User.all.each do |u|
                    u.intournament = false
                    u.tournament_victories = 0
                    u.tournament_defeats = 0
                    u.save
                end
                ActionCable.server.broadcast "notification_#{current_user.id}",
                {
                    action: 'primary',
                    message: "Tournament '#{tour.name}' created"
                }
            else
                ActionCable.server.broadcast "notification_#{current_user.id}",
                {
                    action: 'alert',
                    message: 'Check that you have filled all parameters'
                }
            end
        else
            puts(Rails.logger.info(tour.errors.inspect))
            ActionCable.server.broadcast "notification_#{current_user.id}",
                {
                    action: 'alert',
                    message: 'Check that you have filled all parameters'
                }
        end
    end

    private
    def params_tournament
        params.require(:tournament).permit(:name, :startdate, :finishdate)
    end
end
