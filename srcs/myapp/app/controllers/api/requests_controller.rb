class Api::RequestsController < ApplicationController
    protect_from_forgery
    before_action :authenticate_user!, :request_params, only: [:create]

    def show
        if params[:id].to_i == current_user.id
            user = User.find_by(id: current_user.id)
            requests = user.requests_as_receiver.where(:status => 'pending')
            ret = []
            requests.each do |request|
                if !request.requestor
                    next
                end
                ret.push({
                    :id => request.id,
                    :requestor => request.requestor,
                    :receiver => request.receiver,
                    :category => request.category
                })
            end
            return render json: { "success": ret.to_json }
        end
        render json: { "error": "Forbidden." }
    end

    def create
        if params[:request][:type] == "Friend Request"
            if !requestor = User.find_by(id: params[:request][:requestor_id])
                render json: { "error": "Forbidden." }
            end
        elsif params[:request][:type] == "Guild Request"
            if !requestor = Guild.find_by(id: params[:request][:requestor_id])
                render json: { "error": "Forbidden." }
            end
            if !requestor.officers.include?(params[:request][:officer].to_i) && requestor.owner_id != params[:request][:officer].to_i
                return render json: {"error": "You do not have permissions"}
            end
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
            freq = Request.new(:requestor => requestor, :receiver => receiver, :category => "Friend Request")
            if freq.save!
                receiver.send_request('notification', 'Friend Request', requestor.nickname, freq)
                return render json: { "success": "Friend request sent." }
            end
            return render json: { "error": "Something has gone wrong, try again" }
        # manage guild request
        elsif params[:request][:type] == "Guild Request" && requestor.id == current_user.guild_id && receiver && receiver.id != current_user.id
            if requestor.members.include?(receiver.id) || requestor.officers.include?(receiver.id) || requestor.owner_id == receiver.id
                return render json: { "error": receiver.nickname + " is already in the guild." }
            elsif receiver.guild_id != nil
                return render json: { "error": receiver.nickname + " is already in other guild." }
            end
            freq = Request.new(:requestor => requestor, :receiver => receiver, :category => "Guild Request")
            if freq.save!
                receiver.send_request('notification', 'Guild Request', requestor.title, freq)
                return render json: { "success": "Guild Invitation sent." }
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
            if req.category == "Friend Request"
                if params[:status] == 'accepted'
                    req.status = params[:status]
                    req.save!
                    return render json: { "success": "User added to your friends." }
                elsif params[:status] == 'denied'
                    req.status = params[:status]
                    req.save!
                    return render json: { "success": "User not added to your friends." }
                end
            elsif req.category == "Guild Request"
                if params[:status] == 'accepted'
                    req.status = params[:status]
                    req.save!
                    return render json: { "success": "You have joined the guild!." }
                elsif params[:status] == 'denied'
                    req.status = params[:status]
                    req.save!
                    return render json: { "success": "You haven't joined the guild." }
                end
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
