class Chat < ApplicationRecord
    has_many :messages
    has_many :users, through: :messages
    validates :name, uniqueness: true
end
