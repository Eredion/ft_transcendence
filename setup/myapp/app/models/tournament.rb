class Tournament < ApplicationRecord
    has_many :rounds
    has_many :users
end
