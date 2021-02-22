class Round < ApplicationRecord
    has_many :matches
    belongs_to :tournament
end
