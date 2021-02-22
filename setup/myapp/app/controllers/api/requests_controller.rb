class Api::RequestsController < ApplicationController
    protect_from_forgery
    before_action :authenticate_user!, :request_params, only: [:create]

    def show
=begin
frequests = Request.
select( 'requests.*, users.id AS requestor_id, users.nickname' ).
joins(:requestor).
where([ "receiver_id = ? and requests.status = ? ", params[:id], "pending" ])
=end
        if params[:id].to_i == current_user.id
            user = User.find_by(id: current_user.id)
            requests = user.requests_as_receiver.where(:status => 'pending')
            p requests.to_json
            return render json: { "success": requests.to_json }
        end
        render json: { "error": "Forbidden." }
    end

    def create
        if params[:request][:type] == "Friend Request"
            requestor = User.find_by(id: params[:request][:requestor_id])
        elsif params[:request][:type] == "Guild Request"
            requestor = Guild.find_by(id: params[:request][:requestor_id])
        end
        receiver = User.find_by(id: params[:request][:receiver_id])
        freq = Request.find_by(requestor_id: requestor.id, receiver_id: receiver.id, status: 'pending')
        if freq
            return render json: { "error": "Request already sended." }
        end
        # manage friend request
        if params[:request][:type] == "Friend Request" && requestor.id == current_user.id && receiver && receiver.id != current_user.id
            if requestor.friends.include?(receiver.id)
                return render json: { "error": receiver.nickname + " is already your friend." }
            end
            freq = Request.new(:requestor => requestor, :receiver => receiver)
            if freq.save!
                receiver.send_notification('notification', 'Friend Request', requestor.nickname, freq)
                return render json: { "success": "Friend request sent." }
            end
            return render json: { "error": "Something has gone wrong, try again" }
        end
        render json: { "error": "Forbidden." }
    end

    def update
        req = Request.find_by(id: params[:id], status: 'pending')
        if req && req.receiver_id == params[:receiver_id].to_i \
                && req.requestor_id == params[:requestor_id].to_i \
                && params[:receiver_id].to_i == current_user.id
            if params[:status] == 'accepted'
                req.status = params[:status]
                req.save!
                return render json: { "success": "User added to your friends." }
            elsif params[:status] == 'denied'
                req.status = params[:status]
                req.save!
                return render json: { "success": "User not added to your friends." }
            end
            return render json: { "error": "Something has gone wrong." }
        end
        render json: { "error": "Forbidden." }
    end

    private

    def request_params
        params.require(:request).permit(:requestor_id, :receiver_id, :status, :type)
    end
end
