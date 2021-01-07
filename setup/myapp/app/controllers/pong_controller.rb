class PongController < ApplicationController

    def index
        #    redirect_to user_session_path
        #else
        if user_signed_in?
            @users = User.all
            @messages = Message.all
            @message = Message.new
        end
    end
end
