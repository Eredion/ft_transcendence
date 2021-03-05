class Channel < ApplicationRecord
	
	validates :category, inclusion: %w(private public protected)
	if (:category == "protected")
		has_secure_password
	end
	validates :name, uniqueness: true
	validates :name, length: {maximum: 12}
	validates :name, length: {minimum: 2}
	validates :name, format: { with: /\A[ !¡?_,.ñáéóíúa-zA-Z]+\z/}
	has_many :messages
	has_many :users, through: :messages
	alias_attribute :owner, :user
	belongs_to :user
end
