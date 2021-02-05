class Api::ChannelsController < ApplicationController
    def index
        channels = Channel.all
        render json: channels
    end

    def show
        @channel = Channel.find(params[:id])
        render json: @channel
    end

    def create
        puts("channel controller create")
        channel = Channel.new(channel_params)
        channel.user_id = params[:user]
        channel.category = params[:category]
        #channel.password = params[:password_digest]
        if channel.name.length < 2
            return 
        end
        #channel.category= "public"
        if channel.save
            send_connected_channel(channel)
        else
            puts(Rails.logger.info(channel.errors.inspect))
        end
    end

   private
   def send_connected_channel(channel)
    ActionCable.server.broadcast 'available_channels_channel',
        channel.name
   end

    private
    def channel_params
        params.require(:channel).permit(:name, :category, :user, :password_digest)
    end
end
