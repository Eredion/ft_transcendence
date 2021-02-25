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
        if (params[:war][:startdate] == "")
            ActionCable.server.broadcast "notification_#{current_user.id}",
                {
                    action: 'alert',
                    message: 'Check that you have filled all parameters'
                }
            puts "MEEC"
        elsif (challenged_guild.war_id != nil)
            ActionCable.server.broadcast "notification_#{current_user.id}",
                {
                    action: 'alert',
                    message: 'This guild has already received a war declaration'
                }
            return
        elsif (myguild.war_id != nil)
            ActionCable.server.broadcast "notification_#{current_user.id}",
                {
                    action: 'alert',
                    message: 'Finish all your current wars first'
                }
            return
        end 
        war.to = challenged_guild.title
        war.from = myguild.title
        war.enddate = war.startdate + war.duration.days
        if war.save
            challenged_guild = Guild.find_by(title: params[:war][:against])
            challenged_guild.war_id = war.id
            challenged_guild.save
            myguild.war_id = war.id
            myguild.save
            return
        else
            ActionCable.server.broadcast "notification_#{current_user.id}",
                {
                    action: 'alert',
                    message: 'Check that you have filled all parameters'
                }
            puts(Rails.logger.info(war.errors.inspect))
        end
    end

    def update
        war = War.find_by(id: params[:id])
        if (params[:request][:status] == 'accepted')
            war.status = 'accepted'
            #war.guilds.each do |guild|
            #    guild.inwar = true
            #    guild.save
            #end
            if (war.save)
                WarStartJob.set(wait_until: war.startdate).perform_later()
                War.all.each do |w|
                    if w.status == 'request sent' && 
                        w.destroy
                    end
                end
            end
        else
            ActionCable.server.broadcast "notification_#{current_user.id}",
                {
                    action: 'alert',
                    message: 'Please check all parameters before submitting'
                }
        
        end 
    end

    private
    def params_war
        #params[:war][:duration] = (params[:war][:startdate].to_datetime + params[:war][:duration].to_i.minutes).to_s
        params.require(:war).permit(:startdate, :duration, :wartimehour)
    end

end
    