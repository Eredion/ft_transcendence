class Api::GuildsController < ApplicationController
    def index
        guilds = Guild.all.as_json(only: [:id, :title, :anagram, :score])
        render json: guilds
    end

    def show
        if guild = Guild.joins(:owner).find_by(id: params[:id])
            ret = {
                :guild_id => guild.id,
                :guild_title => guild.title,
                :guild_anagram => guild.anagram,
                :score => guild.score,
                owner: {
                    :owner_id => guild.owner.id,
                    :owner_nickname => guild.owner.nickname,
                    :owner_avatar => guild.owner.avatar
                },
                :officers => User.where(id: guild.officers).as_json(only: [:id, :nickname, :avatar]),
                :members => User.where(id: guild.members).as_json(only: [:id, :nickname, :avatar])
            }
            return render json: { "success": ret.to_json }
        end
        render json: { "error": 'Not Found.' }
    end

    def create
        if Guild.exists?(:title => params[:title])
            return render json: { "error": params[:title] + ' already exists.' }
        end
        if Guild.exists?(:anagram => params[:anagram].upcase)
            return render json: { "error": params[:anagram] + ' already exists.' }
        end
        user = User.find_by(:id => current_user.id)
        if user.guild_id
            return render json: { "error": 'Already in a guild, leave first.' }
        end
        guild = Guild.create(:title => params[:title], :anagram => params[:anagram].upcase, :owner => user)
        user.guild_id = guild.id
        if guild.save! && user.save!
            return render json: { "success": guild }
        end
        render json: { "error": "Some error happened. Try Again" }
    end

    def new_member
        if current_user.id == params[:user_id].to_i
            member = User.find_by(id: params[:user_id])
            if member.guild_id != nil
                return render json: { "error": "Already in a guild, leave it first." }
            end
            if guild = Guild.find_by(id: params[:id])
                guild.members.push(member.id)
                member.guild_id = guild.id
                if member.save! && guild.save!
                    return render json: { "success": "You have joined " + guild.title + " guild" }
                end
                return render json: { "error": "Some error happened. Try Again" }
            end
        end
        render json: { "error": "Forbidden." }
    end

    def eject_member
    end
end