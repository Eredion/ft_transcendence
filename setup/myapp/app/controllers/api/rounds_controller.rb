class Api::RoundsController < ApplicationController
    def index
        rounds = Round.all
        render json: rounds
    end

    def show
        @round = Round.find(params[:id])
        render json: @round
    end
end
