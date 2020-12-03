class PongController < ApplicationController
    def index
        @users = User.all
    end
end
