class Api::MessagesController < ApplicationController
    def index
        render json: Message.all
    end

    def show
        render json: Message.find(params[:id])
    end

    def create
        if (params[:content] == "")
            return
        end
        if (message_params[:content] !~ /\A[ !¡?_,.ñáéóíúa-zA-Z]+\z/)
            ActionCable.server.broadcast "notification_#{current_user.id}",
                {
                    action: 'alert',
                    message: 'Messages cannot contain weird characters'
                }
            return
        end
        msg = Message.new(message_params)
        msg.user_id = User.find_by(id: params[:user_id]).id
        msg.author = User.find_by(id: params[:user_id]).nickname
        if (params[:channel_id])
            ## check if user is silenced
            if (msg.user_id.in?(Channel.find_by(id: params[:channel_id]).silenced))
                ActionCable.server.broadcast "notification_#{current_user.id}",
                {
                    action: 'alert',
                    message: 'You have been muted!'
                }
                return
            end
            p Channel.find_by(id: params[:channel_id]).silenced
            msg.channel_id = params[:channel_id]
            msg.channelname = Channel.find_by(id: params[:channel_id]).name
        elsif (params[:chat_id])
            msg.chat_id = params[:chat_id]
            msg.dest = params[:dest]
            dest_user = User.find_by(nickname: msg.dest)
            if dest_user.blocked.include? msg.user_id
                msg.invisible = true
            end
        else
            return
        end
        if (msg.content.length() < 1)
            return
        end
        if (msg.channel_id && msg.save() )
            puts("channel_messages_#{msg.channelname}")
            ret = msg.as_json
            user = User.find_by(id: msg.user_id)
            ret[:guild] = Guild.find_by(id: user.guild_id).as_json(only: [:anagram])
            ActionCable.server.broadcast "channel_messages_" + msg.channelname, ret
        elsif (msg.chat_id && msg.save() )
      #      dest_id = User.find_by(nickname: msg.dest).id
            if (msg.invisible)
                return
            end
            ActionCable.server.broadcast "dm_" + dest_user.id.to_s, msg
        else
            puts(Rails.logger.info(msg.errors.inspect))
        end

    end

    private
    def get_users(msg_name)
        n = 0
        msg_name.each_char do |a|
            if a == '-'
                break
            end
            n += 1
        end
        id1 = msg_name[0..(n - 1)]
        id2 = msg_name[(n + 1)..msg_name.length]
        return id1, id2
    end

    private
    def message_params
        params.require(:message).permit(:content, :user_id, :chat_id, :channel_id, :dest)
    end
end
