class PongController < ApplicationController

    def index
        if !user_signed_in?
            redirect_to user_session_path
        else
            @users = User.all
            @messages = Message.all
            @message = Message.new
        end
    end
end
