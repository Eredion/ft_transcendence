class Api::ChannelsController < ApplicationController
    protect_from_forgery
    before_action :authenticate_user!

    def index
        channels = Channel.all
        ret = channels.as_json
        ret.each { |channel|
            channel["messages"].each { |message|
                user = User.find_by(id: message["user_id"])
                message[:guild] = Guild.find_by(id: user.guild_id).as_json(only: [:anagram])
            }
        }
        render json: ret
    end

    def show
        @channel = Channel.find_by(id: params[:id])
        render json: @channel
    end

    def create
        puts("channel controller create")
        if (channel_params[:name].length < 2 || channel_params[:name].length > 12)
            return
        end
        channel = Channel.new(channel_params)
        channel.user_id = User.find_by(id: params[:user]).id
        cat = "public"
        if (params[:category] == "protected")
            cat = "protected"
        end
        channel.category = cat
        channel.admins.push(channel.user_id)
        if params[:password]
            channel.password_digest = BCrypt::Password.create(params[:password])
        end
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

    def update
        channel = Channel.find_by(id: params[:id])
        channel.password_digest = BCrypt::Password.create(params[:password])
        channel.category="protected"
        channel.save
        puts channel.name
    end

    def delete
        if (channel_params[:name])
            ch = Channel.find_by(name: channel_params[:name])
            puts "Deleting #{ch.name} channel"
            ch.destroy
        end
    end

    private
    def send_connected_channel(channel)
        ActionCable.server.broadcast 'available_channels_channel',
            channel.name
    end

    def channel_params
        p params
        params.require(:channel).permit(:id, :name, :category, :user, :password, :admins, :channel)
    end
end
