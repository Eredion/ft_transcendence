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
            msg.channel_id = params[:channel_id]
            msg.channelname = Channel.find_by(id: params[:channel_id]).name
        elsif (params[:chat_id])
            msg.chat_id = params[:chat_id]
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
            puts "OK CHAT MESSAGE"
        else
            puts(Rails.logger.info(msg.errors.inspect))
        end

    end

    private
    def message_params
        params.require(:message).permit(:content, :user_id, :chat_id, :channel_id)
    end
end
