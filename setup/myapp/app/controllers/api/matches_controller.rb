class Api::MatchesController < ApplicationController
    def index
        render json: Match.all
    end

    def show
        render json: Match.find(params[:id])
    end
end
