class Api::UsersController < ApplicationController
    protect_from_forgery
    before_action :authenticate_user!

    def index
        users = User.all
        fusers = users.as_json(only: [:id, :nickname, :avatar, :name, :guild_id, :score, :status, :matches_won, :matches_lost,:banned, :blocked, :admin, :intournament, :tournament_defeats, :tournament_victories, :otp_required_for_login])
        render json: fusers
    end

    def show
        user = User.find(params[:id])
        fuser = user.as_json(only: [:id, :nickname, :avatar, :name, :guild_id, :score, :status, :matches_won, :matches_lost, :blocked, :admin, :intournament, :tournament_defeats, :tournament_victories, :otp_required_for_login])
        render json: fuser
    end

    def create
        @user = User.create!(params)
        json_response(@user, :created)
    end

    def update
        if (params[:admin] && current_user.admin)
            user = User.find_by(id: params[:id])
            if (user.id == 1) ## don't allow any change on the webmaster
                return
            end
            user.admin = params[:admin]
            user.save
            if user.admin == true
                user.send_notification('admin')
            end
            return
        end
        if (params[:banned] && current_user.admin == true && current_user.id != params[:id].to_i)
            user = User.find(params[:id])
            user.banned = params[:banned]
            user.save
            if user.banned == true
                user.send_notification('banned')
            end
            return
        end
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
        user.save!
        render json: user, status: :ok
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
        friend_list.each do |user_id|
            f = User.find_by(id: user_id).as_json(only: [:id, :nickname, :avatar, :status])
            match = nil
            if f['status'] == 2
                match = Match.user_matches(f['id']).where(finished: false).first.as_json(only: [:id])
            end
            ret.push({
                :friend => f,
                :current_match => match
            })
        end
        render json: {"success": ret.to_json}, status: :ok
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

    def match_history
        if user = User.find_by(id: params[:id])
            ret = []
            matches = Match.includes(:left_player, :right_player).user_matches(params[:id]).references(:left_player, :right_player)
            matches.each do |match|
                ret.push({
                    :match_id => match.id,
                    :match_type => match.match_type,
                    :left_player_score => match.left_score,
                    :left_player_id => match.left_player.id,
                    :left_player => match.left_player.nickname,
                    :left_player_avatar => match.left_player.avatar,
                    :right_player_score => match.right_score,
                    :right_player_id => match.right_player.id,
                    :right_player => match.right_player.nickname,
                    :right_player_avatar => match.right_player.avatar,
                    :winner => match.winner_id,
                    :loser => match.loser_id,
                    :date => match.created_at
                })
            end
            return render json: {"success": ret.to_json}, status: :ok
        end
        render json: {"error": 'Forbidden.'}, status: :ok
    end

    def guild
        if user = User.find_by(id: params[:id])
            if user.guild_id
                guild = Guild.find_by(id: user.guild_id).as_json(only: [:id, :title, :anagram, :score, :owner_id, :officers, :members, :guild_avatar])
            else
                guild = nil
            end
            return render json: guild
        end
        render json: {"error": 'Forbidden.'}
    end

    def mysession
        if params[:id].to_i == current_user.id
            user = User.find_by(id: current_user.id)
            ret = user.as_json(only: [:id, :nickname, :avatar, :name, :status, :friends, :blocked, :admin, :otp_required_for_login, :otp_validated])
            if guild = Guild.find_by(id: user.guild_id)
                ret[:guild] = guild.as_json(only: [:id, :title, :anagram, :owner_id, :officers, :members])
            else
                ret[:guild] = nil
            end
            return render json: ret
        end
        render json: {"error": 'Forbidden.'}
    end

    def enable_two_fa
        if params[:id].to_i == current_user.id
            current_user.otp_secret = User.generate_otp_secret
            p 'code secret ' + current_user.otp_secret
            current_user.otp_required_for_login = true
            current_user.otp_validated = true
            current_user.save!
            return render json: {"success": "Two-Factor Authentication enabled."}, status: :ok
        end
        render json: {"error": 'Forbidden.'}
    end

    def disable_two_fa
        if params[:id].to_i == current_user.id
            current_user.otp_required_for_login = false
            current_user.save!
            return render json: {"success": "Two-Factor Authentication disabled."}, status: :ok
        end
        render json: {"error": 'Forbidden.'}
    end

    def two_fa
        if params[:id].to_i == current_user.id
            user = User.find_by(id: current_user.id).as_json(only: [:id, :otp_required_for_login])
            ret = {}
            ret[:user_id] = user['id']
            ret[:otp_required] = user['otp_required_for_login']
            if ret[:otp_required] == true
                ret[:qrcode] = generate_qr_code
            end
            return render json: {"success": ret}
        end
        render json: {"error": 'Forbidden.'}
    end

    def validate_two_fa
        if params[:id].to_i == current_user.id
            if current_user.validate_and_consume_otp!(params[:code])
                current_user.update(otp_validated: true)
                return render json: {"success": "Valid Code.", "location": root_path}
            else
                return render json: {"error": "Invalid Code."}
            end
            #validate_and_consume_otp!(params[:code])
        end
        render json: {"error": 'Forbidden.'}
    end

    private

    def generate_qr_code
        issuer = 'ft_transcendence'
        label = "#{issuer}:#{current_user.email}"
        uri = current_user.otp_provisioning_uri(label, issuer: issuer)
        p 'uri qrcode ' + uri
        qrcode = RQRCode::QRCode.new(uri)
        qrcode.as_svg(
            offset: 0,
            color: '000',
            shape_rendering: 'crispEdges',
            module_size: 3,
            standalone: true
        )
    end

end
