class Api::FriendRequestsController < ApplicationController
    protect_from_forgery
    before_action :authenticate_user!, :friend_request_params, only: [:create]

    def show
        if params[:id].to_i == current_user.id
            frequests = FriendRequest.
                        select( 'friend_requests.*, users.id AS requestor_id, users.nickname' ).
                        joins(:requestor).
                        where([ "receiver_id = ? and status = ? ", params[:id], "pending" ])
            puts frequests.to_json
            return render json: { "success": frequests.to_json }
        end
        render json: { "error": "Forbidden." }
    end

    def create
        ufriend = User.find_by(id: params[:friend_request][:receiver_id])
        if params[:friend_request][:requestor_id].to_i == current_user.id && ufriend && ufriend.id != current_user.id
            if current_user.friends.include?(ufriend.id)
                return render json: { "error": ufriend.nickname + " is already your friend." }
            end
            freq = FriendRequest.new(friend_request_params)
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
        params.require(:friend_request).permit(:requestor_id, :receiver_id, :status)
    end
end
