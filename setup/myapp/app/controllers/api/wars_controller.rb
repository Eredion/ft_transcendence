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
        challenged_guild = Guild.find_by(title: params[:war][:against])
        myguild = Guild.find_by(id: current_user.guild_id)
        war.to = challenged_guild.title
        war.from = myguild.title
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
            
            myguild.war_id = war.id
            myguild.save
            return
        else
            puts(Rails.logger.info(war.errors.inspect))
        end
    end

    def update
        war = War.find_by(id: params[:id])
        if (params[:request][:status] == 'accepted')
            #war.status = 'accepted'
            war.guilds.each do |guild|
                puts guild.title
                guild.inwar = true
                guild.save
            end
            war.save
        else
            puts "Error in War update method"
            puts "request: "
            puts params[:request]
        end 
    end

    private
    def params_war
        #params[:war][:duration] = (params[:war][:startdate].to_datetime + params[:war][:duration].to_i.minutes).to_s
        params.require(:war).permit(:startdate, :duration)
    end

end
    