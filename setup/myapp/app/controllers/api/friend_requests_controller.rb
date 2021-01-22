class Api::FriendRequestsController < ApplicationController
    protect_from_forgery
    before_action :authenticate_user!, :friend_request_params, only: [:create]

    def show
        if params[:id].to_i == current_user.id
            frequests = FriendRequest.where([ "receiver_id = ? and status = ? ", params[:id], "pending" ])
            return render json: { "success": frequests }
        end
        render json: { "error": "Forbidden." }
    end

    def create
        ufriend = User.find_by(id: params[:receiver])
        if params[:requestor].to_i == current_user.id && ufriend && ufriend.id != current_user.id
            if current_user.friends.include?(ufriend.id)
                return render json: { "error": ufriend.nickname + " is already your friend." }
            end
            freq = FriendRequest.create(params)
            if freq.save!
                return render json: { "success": "Friend request sent." }
            end
            return render json: { "error": "Something has gone wrong, try again" }
        end
        render json: { "error": "Forbidden." }
    end

    def update
        freq = FriendRequest.find_by(id: params[:freq_id])
        if freq && params[:id].to_i == current_user.id
            freq.status = params[:status]
            freq.save!
            return
        end
        render json: { "error": "Forbidden." }
    end

    private

    def friend_request_params
        params.permit(:requestor, :receiver, :status)
    end
end
