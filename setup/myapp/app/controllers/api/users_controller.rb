class Api::UsersController < ApplicationController
    protect_from_forgery
    before_action :authenticate_user!

    def index
        users = User.all
        fusers = users.as_json(only: [:id, :nickname, :avatar, :name, :guild_id, :score, :status, :matches_won, :matches_lost])
        render json: fusers
    end

    def show
        user = User.find(params[:id])
        fuser = user.as_json(only: [:id, :nickname, :avatar, :name, :guild_id, :score, :status, :matches_won, :matches_lost])
        render json: fuser
    end

    def create
        @user = User.create!(params)
        json_response(@user, :created)
    end

    def update
        user = User.find(current_user.id)
        if params[:nickname] != user.nickname
            if User.exists?(nickname: params[:nickname])
                return render json: {"error": "Nickname " + params[:nickname] + " already exists, please change it."}, status: :ok
            end
            user.nickname = params[:nickname]
        end
        if params[:name] != user.name
            user.name = params[:name]
        end
        if user.save!
            render json: user, status: :ok
        end
    end

    def show_blockeds
        if params[:id].to_i == current_user[:id]
            block_list = User.find(params[:id].to_i)[:blocked]
            ret = []
            block_list.each do |user_id|
                ret.push(User.find_by(id: user_id).as_json(only: [:id, :nickname, :avatar]))
            end
            return render json: {"success": ret.to_json}, status: :ok
        end
        render json: {"error": 'Forbidden.'}, status: :ok
    end

    def show_friends
        friend_list = User.find_by(id: params[:id])[:friends]
        ret = []
        if friend_list
            friend_list.each do |user_id|
                ret.push(User.find_by(id: user_id).as_json(only: [:id, :nickname, :avatar, :status]))
            end
            return render json: {"success": ret.to_json}, status: :ok
        end
        render json: {"error": 'Forbidden.'}, status: :ok
    end

    def delete_friend
        if params[:id].to_i == current_user.id
            if !current_user.friends.include?(params[:user_id].to_i)
                return render json: {"error": "This user is not your friend."}, status: :ok
            end
            othuser = User.find_by(id: params[:user_id])
            if othuser && othuser.id != current_user.id
                current_user.friends.delete(othuser.id)
                if current_user.save!
                    render json: {"success": "Friend removed successfully."}, status: :ok
                end
                if othuser.friends.include?(current_user.id)
                    othuser.friends.delete(current_user.id)
                    othuser.save
                    othuser.send_notification('update_friends')
                end
                return
            end
            return render json: {"error": "The request could not be made, please try again."}, status: :ok

        end
        render json: {"error": 'Forbidden.'}, status: :ok
    end

end
