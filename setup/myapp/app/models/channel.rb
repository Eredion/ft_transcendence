class Channel < ApplicationRecord
	
	validates :category, inclusion: %w(private public protected)
	if (:category == "protected")
		has_secure_password
	end
	validates :name, presence: true, uniqueness: true
	has_many :messages
    has_many :users, through: :messages
end
