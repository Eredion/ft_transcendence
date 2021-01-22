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
        if channel.name.length < 2
            return 
        end
        channel.category= "public"
        if channel.save
            puts(Channel.all.length)
        else
            puts(Rails.logger.info(channel.errors.inspect))
        end
    end

    private
    def channel_params
        params.require(:channel).permit(:name, :category)
    end
end
