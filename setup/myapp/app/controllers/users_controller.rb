class UsersController < ApplicationController

    def sign_in
        @user = User.new
    end
end
