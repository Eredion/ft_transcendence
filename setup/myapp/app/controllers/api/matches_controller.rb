class Api::MatchesController < ApplicationController
    def index
        render json: Match.all
    end

    def show
        if match = Match.joins(:left_player, :right_player).find_by(id: params[:id])
            ret = {
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
                :finished => match.finished
            }
            return render json: { "success": ret.to_json }
        end
        render json: { "error": 'Not Found.' }
    end

    def in_progress
        ret = []
        matches = Match.joins(:left_player, :right_player).where(finished: false)
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
                :right_player_avatar => match.right_player.avatar
            })
        end
        return render json: ret.to_json
    end
end
