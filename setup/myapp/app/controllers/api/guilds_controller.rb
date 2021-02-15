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
end