class Match < ApplicationRecord
    belongs_to :left_player, :class_name => 'User'
    belongs_to :right_player, :class_name => 'User'
    belongs_to :winner, :class_name => 'User', optional: true
    belongs_to :loser, :class_name => 'User', optional: true
    scope :user_matches, ->(user_id){ where("left_player_id = ? or right_player_id = ?", user_id, user_id) }

    def complete_data
        ret = {
            match_id: self.id,
            match_type: self.match_type,
            left_player: {
                id: self.left_player.id,
                nickname: self.left_player.nickname,
                score: self.left_score,
                avatar: self.left_player.avatar,
                ready: self.l_player_ready
            },
            right_player: {
                id: self.right_player.id,
                nickname: self.right_player.nickname,
                score: self.right_score,
                avatar: self.right_player.avatar,
                ready: self.r_player_ready
            },
            winner: self.winner_id,
            loser: self.loser_id,
            finished: self.finished,
            status: self.status
        }
        return ret
    end
end
