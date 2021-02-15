class Api::MessagesController < ApplicationController
    def index
        render json: Message.all
    end

    def show
        render json: Message.find(params[:id])
    end

    def create
        puts("api messages create controller")
        if (params[:content] == "")
            return
        end
        msg = Message.new(message_params)
        msg.user_id = params[:user_id]
        msg.author = User.find_by(id: params[:user_id]).nickname
        if (params[:channel_id])
            if (msg.user_id.in?(Channel.find(params[:channel_id]).silenced))
                puts "IM SILENCED"
                return
            else
                puts"NOPE IM NOT SILENCED"
            end
            p Channel.find_by(id: params[:channel_id]).silenced
            puts "ENd"
            msg.channel_id = params[:channel_id]
            msg.channelname = Channel.find_by(id: params[:channel_id]).name
        elsif (params[:chat_id])
            msg.chat_id = params[:chat_id]
            msg.dest = params[:dest]
        else
            return
        end
        
        puts(msg.content)
        if (msg.content.length() < 1)
            return
        end
        if (msg.channel_id && msg.save() )
            puts("channel_messages_#{msg.channelname}")
            ActionCable.server.broadcast "channel_messages_" + msg.channelname, msg
        elsif (msg.chat_id && msg.save() )
            #id1, id2 = get_users(Chat.find_by(id: msg[:chat_id]).name)
            puts msg.dest
            dest_id = User.find_by(nickname: msg.dest).id
            puts "El destinatario es #{msg.dest} con el id #{dest_id}"
            ActionCable.server.broadcast "dm_" + dest_id.to_s, msg
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
