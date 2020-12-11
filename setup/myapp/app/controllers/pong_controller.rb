class PongController < ApplicationController
    def index
        @users = User.all
        @messages = Message.all
        @message = Message.new
    end
end
