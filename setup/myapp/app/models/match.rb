class Match < ApplicationRecord
    belongs_to :left_player, :class_name => 'User'
    belongs_to :right_player, :class_name => 'User'
    belongs_to :winner, :class_name => 'User', optional: true
    belongs_to :loser, :class_name => 'User', optional: true
    scope :user_matches, ->(user_id){ where("left_player_id = ? or right_player_id = ?", user_id, user_id) }
end
