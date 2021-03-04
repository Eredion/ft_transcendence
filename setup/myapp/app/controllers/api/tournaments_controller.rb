class Api::TournamentsController < ApplicationController

    def index
        tournaments = Tournament.all.as_json(only: [:id, :name, :status, :history, :startdate, :finishdate])
        # render json: tournaments
         render json: tournaments
    end

    def show()
        tournament = Tournament.find_by(id: params[:id])
        render json: tournament
    end

    def create

        if (Tournament.where(status: 'open').length > 0 || Tournament.where(status: 'active').length > 0 )
            ActionCable.server.broadcast "notification_#{current_user.id}",
                {
                    action: 'alert',
                    message: "There is a tournament going on"
                }
            return
        end
        if (tour = Tournament.new(params_tournament))
            if tour.startdate < Time.now
                ActionCable.server.broadcast "notification_#{current_user.id}",
                {
                    action: 'alert',
                    message: 'Tournament must start in the future'
                }
                return
            end    
            if (tour.startdate == nil)
                ActionCable.server.broadcast "notification_#{current_user.id}",
                {
                    action: 'alert',
                    message: 'Check that you have filled all parameters'
                }
            end
            timelen = (params_tournament[:finishdate] == "short") ? 2.minutes : 10.minutes
            tour.finishdate = tour.startdate + timelen
            Tournament.all.each do |tour|
                EndTournamentJob.perform_now(tour)
            end
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
