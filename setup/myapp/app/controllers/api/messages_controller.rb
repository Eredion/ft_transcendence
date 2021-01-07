class Api::MessagesController < ApplicationController
    def index
        render json: Message.all
    end

    def show
        render json: Message.find(params[:id])
    end
end
