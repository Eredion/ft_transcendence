class UsersController < ApplicationController

    before_action :authenticate_user!, :set_user, only: [:show]

    def sign_in
        @user = User.new
    end

    # GET users/:id
    def show
        return render json: @user
    end

    def update_avatar
        user = User.find(params[:id])
        if params[:user][:avatar]
            File.open(params[:user][:avatar]) do |f|
                user.avatar = f
            end
            if user.save!
                fusers = user.as_json(only: [:id, :nickname, :avatar, :name, :guild_id, :score, :matches_won, :matches_lost])
                render json: fusers, status: :ok
            end
        end
    end

    def block_user
        if params[:id].to_i == current_user.id
            c_user = User.find(params[:id])
            if params[:user_id] != c_user.id && c_user.blocked.index(params[:user_id]) == nil && User.find(params[:user_id])
                c_user.blocked.push(params[:user_id])
                if c_user.save!
                    return render json: {"success": "User blocked successfully."}, status: :ok
                end
            end
            return render json: {"error": "The request could not be made, please try again."}, status: :ok
        end
        render json: {"error": "Forbidden."}, status: :ok
    end

    def unblock_user
        if params[:id].to_i == current_user.id
            c_user = User.find(params[:id])
            if params[:user_id] != c_user.id && c_user.blocked.index(params[:user_id]) != nil && User.find(params[:user_id])
                c_user.blocked.delete(params[:user_id])
                if c_user.save!
                    return render json: {"success": "User unblocked successfully."}, status: :ok
                end
            end
            return render json: {"error": "The request could not be made, please try again."}, status: :ok
        end
        render json: {"error": "Forbidden."}, status: :ok
    end

    def show_blocks
        if params[:id].to_i == current_user[:id]
            block_list = User.find(params[:id])[:blocked]
            ret = []
            block_list.each do |user_id|
                ret.push(User.find_by(id: user_id).as_json(only: [:id, :nickname, :avatar]))
            end
            return render json: {"success": ret.to_json}, status: :ok
        end
        render json: {"error": 'Forbidden.'}, status: :ok
    end

    private

    def set_user
        fuser = User.find(params[:id])
        @user = fuser.as_json(only: [:id, :nickname, :avatar])
    end
end
