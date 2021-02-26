class UsersController < ApplicationController

    before_action :authenticate_user!, :set_user, only: [:show]

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
            if current_user.blocked.include?(params[:user_id].to_i)
                return render json: {"error": "User already blocked."}, status: :ok
            elsif params[:user_id].to_i != current_user.id && User.find(params[:user_id].to_i)
                current_user.blocked.push(params[:user_id].to_i)
                if current_user.save!
                    return render json: {"success": "User blocked successfully."}, status: :ok
                end
            end
            return render json: {"error": "The request could not be made, please try again."}, status: :ok
        end
        render json: {"error": "Forbidden."}, status: :ok
    end

    def unblock_user
        if params[:id].to_i == current_user.id
            if !current_user.blocked.include?(params[:user_id].to_i)
                return render json: {"error": "User not blocked."}, status: :ok
            elsif params[:user_id].to_i != current_user.id && User.find(params[:user_id].to_i)
                current_user.blocked.delete(params[:user_id].to_i)
                if current_user.save!
                    return render json: {"success": "User unblocked successfully."}, status: :ok
                end
            end
            return render json: {"error": "The request could not be made, please try again."}, status: :ok
        end
        render json: {"error": "Forbidden."}, status: :ok
    end

    private

    def set_user
        fuser = User.find(params[:id])
        @user = fuser.as_json(only: [:id, :nickname, :avatar])
    end
end
