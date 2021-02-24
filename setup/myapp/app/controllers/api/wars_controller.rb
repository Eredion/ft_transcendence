class Api::WarsController < ApplicationController

    def index
        wars = War.all
        render json: wars
    end

    def show
        wars = War.find(params[:id])
        render json: wars
    end

    def create
        war = War.new(params_war)
        if war.save
            puts params[:war][:against]
            puts params[:war][:against]
            puts params[:war][:against]
            puts params[:war][:against]
            puts params[:war][:against]
            puts params[:war][:against]
            puts params[:war][:against]
            puts params[:war][:against]
            puts params[:war][:against]
            challenged_guild = Guild.find_by(title: params[:war][:against])
            challenged_guild.war_id = war.id
            challenged_guild.save
            challenged_guild = Guild.find_by(id: current_user.guild_id)
            challenged_guild.war_id = war.id
            challenged_guild.save
            return
        else
            puts(Rails.logger.info(war.errors.inspect))
        end
    end

    private
    def params_war
        #params[:war][:duration] = (params[:war][:startdate].to_datetime + params[:war][:duration].to_i.minutes).to_s
        params.require(:war).permit(:startdate, :duration)
    end

    
end
    