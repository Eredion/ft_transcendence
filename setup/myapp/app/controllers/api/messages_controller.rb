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
        msg = Messages.new(message_params)
        if msg.save()
            ActionCable.server.broadcast 'channel_messages_channel', msg
        else
            puts(Rails.logger.info(msg.errors.inspect))
        end

    end

    private
    def message_params
        params.require(:message).permit(:content, :user_id, :chat_id, :channel_id)
    end
end
